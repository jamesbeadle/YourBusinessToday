-- 0058: a task or goal has people in its conversation, and every message on it
-- tells them. Being assigned to a task was the only way to be told before;
-- now posting, being assigned or raising the task or goal joins you, and anyone
-- on the project can add or remove people by hand. Safe to re-run.

create table if not exists public.conversation_participants (
	goal_id uuid references public.goals (id) on delete cascade,
	task_id uuid references public.tasks (id) on delete cascade,
	account_id uuid not null references auth.users (id) on delete cascade,
	joined_at timestamptz not null default now(),
	constraint conversation_participants_one_subject
		check ((goal_id is null) <> (task_id is null)),
	constraint conversation_participants_once_each
		unique nulls not distinct (goal_id, task_id, account_id)
);

alter table public.conversation_participants enable row level security;

drop policy if exists "people on a project manage its conversations" on public.conversation_participants;
create policy "people on a project manage its conversations" on public.conversation_participants
	for all
	using (public.can_reach_project(public.message_project_id(goal_id, task_id)))
	with check (public.can_reach_project(public.message_project_id(goal_id, task_id)));

-- ---------------------------------------------------------------------------
-- A notification can be about a goal message as well as a task message.
-- ---------------------------------------------------------------------------

alter table public.notifications
	add column if not exists goal_id uuid references public.goals (id) on delete cascade,
	alter column task_id drop not null;

alter table public.notifications drop constraint if exists notifications_one_subject;
alter table public.notifications add constraint notifications_one_subject
	check ((goal_id is null) <> (task_id is null));

-- ---------------------------------------------------------------------------
-- Joining the conversation: by posting, by being assigned, by raising it.
-- ---------------------------------------------------------------------------

create or replace function public.is_person_on_project(project uuid, account uuid)
returns boolean
language sql
stable
security definer
set search_path to 'public'
as $$
	select exists (select 1 from projects where id = project and owner_id = account)
		or exists (
			select 1 from project_members
			where project_id = project and account_id = account
		);
$$;

-- Only someone on the project joins; a stranger's message or assignment leaves no trace.
create or replace function public.join_conversation(goal uuid, task uuid, account uuid)
returns void
language sql
security definer
set search_path to 'public'
as $$
	insert into public.conversation_participants (goal_id, task_id, account_id)
	select goal, task, account
	where account is not null
		and public.is_person_on_project(public.message_project_id(goal, task), account)
	on conflict do nothing;
$$;

create or replace function public.notify_participants_of_message()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
	perform public.join_conversation(new.goal_id, new.task_id, new.author_account_id);
	insert into public.notifications (recipient_id, goal_id, task_id, message_id)
	select participants.account_id, new.goal_id, new.task_id, new.id
	from public.conversation_participants as participants
	where participants.account_id <> new.author_account_id
		and (participants.task_id = new.task_id or participants.goal_id = new.goal_id);
	return new;
end;
$$;

drop trigger if exists conversation_message_notifications on public.conversation_messages;
create trigger conversation_message_notifications
	after insert on public.conversation_messages
	for each row execute function public.notify_participants_of_message();

create or replace function public.join_conversation_on_assignment()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
	perform public.join_conversation(null, new.task_id, new.profile_id);
	return new;
end;
$$;

drop trigger if exists task_assignee_joins_conversation on public.task_assignees;
create trigger task_assignee_joins_conversation
	after insert on public.task_assignees
	for each row execute function public.join_conversation_on_assignment();

create or replace function public.join_conversation_on_raising_task()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
	perform public.join_conversation(null, new.id, new.created_by);
	return new;
end;
$$;

drop trigger if exists task_creator_joins_conversation on public.tasks;
create trigger task_creator_joins_conversation
	after insert on public.tasks
	for each row execute function public.join_conversation_on_raising_task();

create or replace function public.join_conversation_on_raising_goal()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
	perform public.join_conversation(new.id, null, new.created_by);
	return new;
end;
$$;

drop trigger if exists goal_creator_joins_conversation on public.goals;
create trigger goal_creator_joins_conversation
	after insert on public.goals
	for each row execute function public.join_conversation_on_raising_goal();

-- Someone taken off a project leaves every conversation on it.
create or replace function public.leave_conversations_on_project()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
	delete from public.conversation_participants as participants
	where participants.account_id = old.account_id
		and public.message_project_id(participants.goal_id, participants.task_id) = old.project_id;
	return old;
end;
$$;

drop trigger if exists removed_member_leaves_conversations on public.project_members;
create trigger removed_member_leaves_conversations
	after delete on public.project_members
	for each row execute function public.leave_conversations_on_project();

-- ---------------------------------------------------------------------------
-- The people already in each conversation: its assignees, its authors, whoever
-- raised it.
-- ---------------------------------------------------------------------------

select public.join_conversation(null, task_id, profile_id) from public.task_assignees;
select public.join_conversation(goal_id, task_id, author_account_id) from public.conversation_messages;
select public.join_conversation(null, id, created_by) from public.tasks;
select public.join_conversation(id, null, created_by) from public.goals;

drop function if exists public.notify_task_assignees_of_message();

notify pgrst, 'reload schema';
