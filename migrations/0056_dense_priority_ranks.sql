-- 0056: priority is a rank.
--
-- Every ordered layer is a ranked set: projects on an owner's board, goals on
-- a project, tasks beside each other under one parent, and the queue of top
-- level tasks across every project one person owns. Within each scope the
-- ranks are exactly 1..n, 1 at the top, so "make this priority 3" means the
-- same thing to a person and to an AI reading the numbers back. The app keeps
-- the invariant on every write; this migration establishes it once by closing
-- the gaps that swaps and deletes have left, keeping every current order as it
-- is. No user-entered data changes — only the order numbers, which are derived.
--
-- transfer_project_ownership now re-ranks too: the project joins the bottom of
-- the new owner's board and its top level tasks the bottom of their queue, and
-- the old owner's board and queue close the gaps. Safe to re-run.
--
-- Run once, by hand, through scripts/run-migration.sh.

begin;

-- ---------------------------------------------------------------------------
-- Compaction, one function per scope, callable again whenever needed.
-- ---------------------------------------------------------------------------

create or replace function public.compact_project_board(board_owner uuid)
returns void
language sql
security definer
set search_path to 'public'
as $$
	update public.projects as project
	set priority = ranked.rank
	from (
		select id, row_number() over (order by priority, created_at) as rank
		from public.projects
		where owner_id = board_owner
	) as ranked
	where project.id = ranked.id and project.priority is distinct from ranked.rank;
$$;

create or replace function public.compact_goal_ranks(goal_project uuid)
returns void
language sql
security definer
set search_path to 'public'
as $$
	update public.goals as goal
	set priority = ranked.rank
	from (
		select id, row_number() over (order by priority, created_at) as rank
		from public.goals
		where project_id = goal_project
	) as ranked
	where goal.id = ranked.id and goal.priority is distinct from ranked.rank;
$$;

create or replace function public.compact_task_sibling_ranks(sibling_project uuid)
returns void
language sql
security definer
set search_path to 'public'
as $$
	update public.tasks as task
	set priority = ranked.rank
	from (
		select id, row_number() over (
			partition by parent_task_id order by priority, created_at
		) as rank
		from public.tasks
		where project_id = sibling_project
	) as ranked
	where task.id = ranked.id and task.priority is distinct from ranked.rank;
$$;

create or replace function public.compact_task_queue(queue_owner uuid)
returns void
language sql
security definer
set search_path to 'public'
as $$
	update public.tasks as task
	set global_priority = ranked.rank
	from (
		select task.id, row_number() over (
			order by task.global_priority nulls last, project.priority, task.priority, task.created_at
		) as rank
		from public.tasks as task
		join public.projects as project on project.id = task.project_id
		where project.owner_id = queue_owner and task.parent_task_id is null
	) as ranked
	where task.id = ranked.id and task.global_priority is distinct from ranked.rank;
$$;

revoke execute on function public.compact_project_board(uuid) from anon;
revoke execute on function public.compact_goal_ranks(uuid) from anon;
revoke execute on function public.compact_task_sibling_ranks(uuid) from anon;
revoke execute on function public.compact_task_queue(uuid) from anon;

-- ---------------------------------------------------------------------------
-- Establish the invariant once, everywhere.
-- ---------------------------------------------------------------------------

select public.compact_project_board(owner_id)
from (select distinct owner_id from public.projects) as boards;

select public.compact_goal_ranks(project_id)
from (select distinct project_id from public.goals) as goal_projects;

select public.compact_task_sibling_ranks(project_id)
from (select distinct project_id from public.tasks) as task_projects;

update public.tasks set global_priority = null where parent_task_id is not null;

select public.compact_task_queue(owner_id)
from (select distinct owner_id from public.projects) as queues;

-- ---------------------------------------------------------------------------
-- A project changing hands changes boards and queues.
-- ---------------------------------------------------------------------------

create or replace function public.transfer_project_ownership(project uuid, new_owner uuid)
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
declare
	old_owner uuid;
	queue_length integer;
begin
	if not (public.owns_project(project) or auth.role() = 'service_role') then
		raise exception 'not_the_owner';
	end if;
	select owner_id into old_owner from public.projects where id = project;
	if old_owner is null then
		raise exception 'no_such_project';
	end if;
	if not exists (
		select 1 from public.project_members
		where project_id = project and account_id = new_owner
	) then
		raise exception 'new_owner_not_a_member';
	end if;
	select count(*) into queue_length
	from public.tasks as task
	join public.projects as owned on owned.id = task.project_id
	where owned.owner_id = new_owner and task.parent_task_id is null;
	update public.projects
	set owner_id = new_owner,
		priority = (select count(*) + 1 from public.projects where owner_id = new_owner)
	where id = project;
	update public.tasks as task
	set global_priority = queue_length + ranked.rank
	from (
		select id, row_number() over (order by priority, created_at) as rank
		from public.tasks
		where project_id = project and parent_task_id is null
	) as ranked
	where task.id = ranked.id;
	delete from public.project_members where project_id = project and account_id = new_owner;
	insert into public.project_members (project_id, account_id, added_by)
	values (project, old_owner, new_owner)
	on conflict do nothing;
	perform public.compact_project_board(old_owner);
	perform public.compact_task_queue(old_owner);
end;
$$;

revoke execute on function public.transfer_project_ownership(uuid, uuid) from anon;

commit;
