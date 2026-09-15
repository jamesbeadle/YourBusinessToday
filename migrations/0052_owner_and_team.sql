-- 0052: a project belongs to its owner and is worked by its members.
--
-- Access to a project stops being a staff flag and becomes a relationship
-- with the project: the owner (projects.owner_id) manages it, invites people
-- and can hand it on; members do everything on it except manage it. This
-- migration is additive: the new owner-and-member policies sit beside the
-- staff-wide ones, which 0053 removes once the code that uses them is live.
--
-- Run once, by hand, through scripts/run-migration.sh.

begin;

-- ---------------------------------------------------------------------------
-- Standing: who owns, and who may reach, a project.
-- ---------------------------------------------------------------------------

create or replace function public.owns_project(project uuid)
returns boolean
language sql
stable
security definer
set search_path to 'public'
as $$
	select exists (
		select 1 from projects where id = project and owner_id = auth.uid()
	);
$$;

create or replace function public.can_reach_project(project uuid)
returns boolean
language sql
stable
security definer
set search_path to 'public'
as $$
	select public.owns_project(project) or public.is_project_member(project);
$$;

create or replace function public.task_project_id(task uuid)
returns uuid
language sql
stable
security definer
set search_path to 'public'
as $$
	select project_id from tasks where id = task;
$$;

create or replace function public.checklist_project_id(checklist uuid)
returns uuid
language sql
stable
security definer
set search_path to 'public'
as $$
	select tasks.project_id
	from task_checklists
	join tasks on tasks.id = task_checklists.task_id
	where task_checklists.id = checklist;
$$;

create or replace function public.can_reach_task(task uuid)
returns boolean
language sql
stable
security definer
set search_path to 'public'
as $$
	select public.can_reach_project(public.task_project_id(task));
$$;

-- An attachment lives at <task id>/<attachment id>/<filename>.
create or replace function public.attachment_task_id(object_name text)
returns uuid
language sql
immutable
as $$
	select case
		when split_part(object_name, '/', 1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
		then split_part(object_name, '/', 1)::uuid
	end;
$$;

-- ---------------------------------------------------------------------------
-- The people on a project: the owner and the members, with their names.
-- ---------------------------------------------------------------------------

create or replace function public.project_people(project uuid)
returns table (id uuid, email text, display_name text, is_owner boolean)
language plpgsql
stable
security definer
set search_path to 'public'
as $$
begin
	if not (public.can_reach_project(project) or auth.role() = 'service_role') then
		raise exception 'not_on_project';
	end if;
	return query
		select profiles.id, profiles.email, profiles.display_name, true
		from public.projects
		join public.profiles on profiles.id = projects.owner_id
		where projects.id = project
		union all
		select profiles.id, profiles.email, profiles.display_name, false
		from public.project_members
		join public.profiles on profiles.id = project_members.account_id
		where project_members.project_id = project
		order by 4 desc, 3, 2;
end;
$$;

-- ---------------------------------------------------------------------------
-- The team list: projects the caller is on but does not own, with their owner.
-- ---------------------------------------------------------------------------

create or replace function public.team_projects(member uuid default auth.uid())
returns table (
	project jsonb,
	owner_name text,
	open_task_count integer
)
language plpgsql
stable
security definer
set search_path to 'public'
as $$
begin
	if not (member = auth.uid() or auth.role() = 'service_role') then
		raise exception 'not_your_list';
	end if;
	return query
		select
			to_jsonb(projects.*),
			coalesce(nullif(trim(owner.display_name), ''), owner.email),
			(select count(*)::integer from tasks where tasks.project_id = projects.id and tasks.status <> 'done')
		from project_members
		join projects on projects.id = project_members.project_id
		join profiles owner on owner.id = projects.owner_id
		where project_members.account_id = member
		order by projects.name;
end;
$$;

revoke execute on function public.team_projects(uuid) from anon;

-- ---------------------------------------------------------------------------
-- Handing a project on: the new owner leaves the members, the old one joins.
-- ---------------------------------------------------------------------------

create or replace function public.transfer_project_ownership(project uuid, new_owner uuid)
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
declare
	old_owner uuid;
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
	update public.projects set owner_id = new_owner where id = project;
	delete from public.project_members where project_id = project and account_id = new_owner;
	insert into public.project_members (project_id, account_id, added_by)
	values (project, old_owner, new_owner)
	on conflict do nothing;
end;
$$;

revoke execute on function public.transfer_project_ownership(uuid, uuid) from anon;
revoke execute on function public.project_people(uuid) from anon;

-- ---------------------------------------------------------------------------
-- Policies: reach by relationship, manage by ownership.
-- ---------------------------------------------------------------------------

drop policy if exists "members read their projects" on public.projects;
drop policy if exists "people reach their projects" on public.projects;
create policy "people reach their projects" on public.projects
	for select using (public.can_reach_project(id));
drop policy if exists "accounts create projects they own" on public.projects;
create policy "accounts create projects they own" on public.projects
	for insert with check (owner_id = auth.uid());
drop policy if exists "owners change their projects" on public.projects;
create policy "owners change their projects" on public.projects
	for update using (public.owns_project(id)) with check (public.owns_project(id));
drop policy if exists "owners delete their projects" on public.projects;
create policy "owners delete their projects" on public.projects
	for delete using (public.owns_project(id));

drop policy if exists "members read their own membership" on public.project_members;
drop policy if exists "people read who is on their projects" on public.project_members;
create policy "people read who is on their projects" on public.project_members
	for select using (public.can_reach_project(project_id));
drop policy if exists "owners manage who is on their projects" on public.project_members;
create policy "owners manage who is on their projects" on public.project_members
	for all using (public.owns_project(project_id)) with check (public.owns_project(project_id));

drop policy if exists "members read goals on their projects" on public.goals;
drop policy if exists "people work goals on their projects" on public.goals;
create policy "people work goals on their projects" on public.goals
	for all using (public.can_reach_project(project_id))
	with check (public.can_reach_project(project_id));

drop policy if exists "members read tasks on their projects" on public.tasks;
drop policy if exists "people work tasks on their projects" on public.tasks;
create policy "people work tasks on their projects" on public.tasks
	for all using (public.can_reach_project(project_id))
	with check (public.can_reach_project(project_id));

drop policy if exists "people work criteria on their projects" on public.acceptance_criteria;
create policy "people work criteria on their projects" on public.acceptance_criteria
	for all using (public.can_reach_task(task_id)) with check (public.can_reach_task(task_id));

drop policy if exists "people work checklists on their projects" on public.task_checklists;
create policy "people work checklists on their projects" on public.task_checklists
	for all using (public.can_reach_task(task_id)) with check (public.can_reach_task(task_id));

drop policy if exists "people work checklist items on their projects" on public.task_checklist_items;
create policy "people work checklist items on their projects" on public.task_checklist_items
	for all using (public.can_reach_project(public.checklist_project_id(checklist_id)))
	with check (public.can_reach_project(public.checklist_project_id(checklist_id)));

drop policy if exists "people work attachments on their projects" on public.task_attachments;
create policy "people work attachments on their projects" on public.task_attachments
	for all using (public.can_reach_task(task_id)) with check (public.can_reach_task(task_id));

drop policy if exists "people assign tasks on their projects" on public.task_assignees;
create policy "people assign tasks on their projects" on public.task_assignees
	for all using (public.can_reach_task(task_id)) with check (public.can_reach_task(task_id));

drop policy if exists "people set roles on their projects" on public.task_roles;
create policy "people set roles on their projects" on public.task_roles
	for all using (public.can_reach_task(task_id)) with check (public.can_reach_task(task_id));

-- Internal notes were staff talking among themselves. Nobody new writes them;
-- the ones that exist stay with the owner rather than opening to the team.
drop policy if exists "members read shared messages on their projects" on public.conversation_messages;
drop policy if exists "members post shared messages on their projects" on public.conversation_messages;
drop policy if exists "people read messages on their projects" on public.conversation_messages;
create policy "people read messages on their projects" on public.conversation_messages
	for select using (
		public.can_reach_project(public.message_project_id(goal_id, task_id))
		and (not is_internal or public.owns_project(public.message_project_id(goal_id, task_id)))
	);
drop policy if exists "people post on their projects" on public.conversation_messages;
create policy "people post on their projects" on public.conversation_messages
	for insert with check (
		not is_internal
		and author_account_id = auth.uid()
		and public.can_reach_project(public.message_project_id(goal_id, task_id))
	);

drop policy if exists "people add attachment files on their projects" on storage.objects;
create policy "people add attachment files on their projects" on storage.objects
	for insert with check (
		bucket_id = 'task-attachments' and public.can_reach_task(public.attachment_task_id(name))
	);
drop policy if exists "people read attachment files on their projects" on storage.objects;
create policy "people read attachment files on their projects" on storage.objects
	for select using (
		bucket_id = 'task-attachments' and public.can_reach_task(public.attachment_task_id(name))
	);
drop policy if exists "people remove attachment files on their projects" on storage.objects;
create policy "people remove attachment files on their projects" on storage.objects
	for delete using (
		bucket_id = 'task-attachments' and public.can_reach_task(public.attachment_task_id(name))
	);

commit;

notify pgrst, 'reload schema';
