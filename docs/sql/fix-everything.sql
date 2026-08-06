-- ============================================================================
-- FIX EVERYTHING — full project-management schema, safe from any state.
-- Paste the whole file into the Supabase SQL editor and run it once.
-- Every statement is idempotent: re-running is always safe.
-- Combines docs/sql/project-management.sql + project-management-upgrade.sql
-- (from main), then reloads the API schema cache and verifies the result.
-- ============================================================================

-- Project management: staff role, projects, tasks, comments.
-- Run once in the Supabase SQL editor. Idempotent where possible.

-- ---------------------------------------------------------------------------
-- Profiles: the staff flag and a display name for assignees and comments.
-- ---------------------------------------------------------------------------

alter table public.profiles add column if not exists is_staff boolean not null default false;
alter table public.profiles add column if not exists display_name text not null default '';

update public.profiles set is_admin = true where email = 'jamesbeadle1989@gmail.com';

-- ---------------------------------------------------------------------------
-- Access helpers.
-- ---------------------------------------------------------------------------

create or replace function public.is_project_manager()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
	select exists (
		select 1 from public.profiles
		where id = auth.uid()
			and (is_staff or is_admin)
			and not is_restricted
	);
$$;

create or replace function public.assert_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
	if not exists (
		select 1 from public.profiles where id = auth.uid() and is_admin
	) then
		raise exception 'admin_only';
	end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- Tables.
-- ---------------------------------------------------------------------------

create table if not exists public.projects (
	id uuid primary key default gen_random_uuid(),
	name text not null,
	description text not null default '',
	is_archived boolean not null default false,
	created_by uuid not null references auth.users (id),
	created_at timestamptz not null default now()
);

create table if not exists public.tasks (
	id uuid primary key default gen_random_uuid(),
	project_id uuid not null references public.projects (id) on delete cascade,
	title text not null,
	details text not null default '',
	status text not null default 'backlog'
		check (status in ('backlog', 'in_progress', 'done')),
	priority integer not null,
	due_date date,
	assignee_id uuid references public.profiles (id) on delete set null,
	created_by uuid not null references auth.users (id),
	created_at timestamptz not null default now()
);

create index if not exists tasks_project_priority on public.tasks (project_id, priority);

create table if not exists public.task_comments (
	id uuid primary key default gen_random_uuid(),
	task_id uuid not null references public.tasks (id) on delete cascade,
	author_id uuid not null references public.profiles (id),
	body text not null,
	created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row-level security: staff and admins share one workspace.
-- ---------------------------------------------------------------------------

alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.task_comments enable row level security;

drop policy if exists "project managers manage projects" on public.projects;
create policy "project managers manage projects" on public.projects
	for all using (public.is_project_manager()) with check (public.is_project_manager());

drop policy if exists "project managers manage tasks" on public.tasks;
create policy "project managers manage tasks" on public.tasks
	for all using (public.is_project_manager()) with check (public.is_project_manager());

drop policy if exists "project managers manage task comments" on public.task_comments;
create policy "project managers manage task comments" on public.task_comments
	for all using (public.is_project_manager()) with check (public.is_project_manager());

-- ---------------------------------------------------------------------------
-- Functions the app calls.
-- ---------------------------------------------------------------------------

create or replace function public.admin_set_staff(target_email text, staff boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
	perform public.assert_admin();
	update public.profiles set is_staff = staff where email = target_email;
end;
$$;

create or replace function public.admin_list_staff_flags()
returns table (email text, is_staff boolean)
language plpgsql
security definer
set search_path = public
as $$
begin
	perform public.assert_admin();
	return query select profiles.email, profiles.is_staff from public.profiles;
end;
$$;

create or replace function public.staff_directory()
returns table (id uuid, email text, display_name text)
language plpgsql
security definer
set search_path = public
as $$
begin
	if not public.is_project_manager() then
		raise exception 'staff_only';
	end if;
	return query
		select profiles.id, profiles.email, profiles.display_name
		from public.profiles
		where profiles.is_staff or profiles.is_admin
		order by profiles.email;
end;
$$;

create or replace function public.set_display_name(new_display_name text)
returns void
language sql
security definer
set search_path = public
as $$
	update public.profiles
	set display_name = trim(new_display_name)
	where id = auth.uid();
$$;

-- ============================================================================
-- Part 2: the upgrade (phases, sprints, assignees, roles, criteria, notifications)
-- ============================================================================

-- Project management upgrade: phases, sprints, story points, completion,
-- user stories, acceptance criteria, multi-assignee, roles, notifications.
-- Run once in the Supabase SQL editor, after project-management.sql. Idempotent where possible.

-- ---------------------------------------------------------------------------
-- Phases: ordered stages of a project.
-- ---------------------------------------------------------------------------

create table if not exists public.phases (
	id uuid primary key default gen_random_uuid(),
	project_id uuid not null references public.projects (id) on delete cascade,
	name text not null,
	position integer not null,
	created_at timestamptz not null default now()
);

create index if not exists phases_project_position on public.phases (project_id, position);

-- ---------------------------------------------------------------------------
-- Sprints: a named batch of tasks, drawn from any phase of the project.
-- ---------------------------------------------------------------------------

create table if not exists public.sprints (
	id uuid primary key default gen_random_uuid(),
	project_id uuid not null references public.projects (id) on delete cascade,
	name text not null,
	starts_on date,
	ends_on date,
	created_at timestamptz not null default now()
);

create index if not exists sprints_project on public.sprints (project_id);

-- ---------------------------------------------------------------------------
-- Tasks: phase, sprint, Fibonacci story points, completion, user story fields.
-- ---------------------------------------------------------------------------

alter table public.tasks
	add column if not exists phase_id uuid references public.phases (id) on delete set null,
	add column if not exists sprint_id uuid references public.sprints (id) on delete set null,
	add column if not exists story_points integer not null default 2,
	add column if not exists completion_percent integer not null default 0,
	add column if not exists is_user_story boolean not null default false,
	add column if not exists story_role text not null default '',
	add column if not exists story_want text not null default '',
	add column if not exists story_benefit text not null default '';

alter table public.tasks drop constraint if exists tasks_story_points_fibonacci;
alter table public.tasks add constraint tasks_story_points_fibonacci
	check (story_points in (1, 2, 3, 5, 8, 13, 21));

alter table public.tasks drop constraint if exists tasks_completion_percent_range;
alter table public.tasks add constraint tasks_completion_percent_range
	check (completion_percent between 0 and 100);

update public.tasks set completion_percent = 100 where status = 'done' and completion_percent = 0;

-- ---------------------------------------------------------------------------
-- Multiple assignees and roles per task. Existing single assignees migrate over.
-- ---------------------------------------------------------------------------

create table if not exists public.task_assignees (
	task_id uuid not null references public.tasks (id) on delete cascade,
	profile_id uuid not null references public.profiles (id) on delete cascade,
	primary key (task_id, profile_id)
);

do $$
begin
	if exists (
		select 1 from information_schema.columns
		where table_schema = 'public' and table_name = 'tasks' and column_name = 'assignee_id'
	) then
		insert into public.task_assignees (task_id, profile_id)
		select id, assignee_id from public.tasks where assignee_id is not null
		on conflict do nothing;
		alter table public.tasks drop column assignee_id;
	end if;
end;
$$;

create table if not exists public.task_roles (
	task_id uuid not null references public.tasks (id) on delete cascade,
	role text not null,
	primary key (task_id, role)
);

-- ---------------------------------------------------------------------------
-- Acceptance criteria: checkable statements a user story must satisfy.
-- ---------------------------------------------------------------------------

create table if not exists public.acceptance_criteria (
	id uuid primary key default gen_random_uuid(),
	task_id uuid not null references public.tasks (id) on delete cascade,
	description text not null,
	is_met boolean not null default false,
	position integer not null,
	created_at timestamptz not null default now()
);

create index if not exists acceptance_criteria_task_position
	on public.acceptance_criteria (task_id, position);

-- ---------------------------------------------------------------------------
-- Notifications: raised when someone comments on a task assigned to you.
-- ---------------------------------------------------------------------------

create table if not exists public.notifications (
	id uuid primary key default gen_random_uuid(),
	recipient_id uuid not null references public.profiles (id) on delete cascade,
	task_id uuid not null references public.tasks (id) on delete cascade,
	comment_id uuid not null references public.task_comments (id) on delete cascade,
	is_read boolean not null default false,
	created_at timestamptz not null default now()
);

create index if not exists notifications_recipient_unread
	on public.notifications (recipient_id, is_read, created_at desc);

create or replace function public.notify_task_assignees_of_comment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
	insert into public.notifications (recipient_id, task_id, comment_id)
	select task_assignees.profile_id, new.task_id, new.id
	from public.task_assignees
	where task_assignees.task_id = new.task_id
		and task_assignees.profile_id <> new.author_id;
	return new;
end;
$$;

drop trigger if exists task_comment_notifications on public.task_comments;
create trigger task_comment_notifications
	after insert on public.task_comments
	for each row execute function public.notify_task_assignees_of_comment();

-- ---------------------------------------------------------------------------
-- Row-level security.
-- ---------------------------------------------------------------------------

alter table public.phases enable row level security;
alter table public.sprints enable row level security;
alter table public.task_assignees enable row level security;
alter table public.task_roles enable row level security;
alter table public.acceptance_criteria enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "project managers manage phases" on public.phases;
create policy "project managers manage phases" on public.phases
	for all using (public.is_project_manager()) with check (public.is_project_manager());

drop policy if exists "project managers manage sprints" on public.sprints;
create policy "project managers manage sprints" on public.sprints
	for all using (public.is_project_manager()) with check (public.is_project_manager());

drop policy if exists "project managers manage task assignees" on public.task_assignees;
create policy "project managers manage task assignees" on public.task_assignees
	for all using (public.is_project_manager()) with check (public.is_project_manager());

drop policy if exists "project managers manage task roles" on public.task_roles;
create policy "project managers manage task roles" on public.task_roles
	for all using (public.is_project_manager()) with check (public.is_project_manager());

drop policy if exists "project managers manage acceptance criteria" on public.acceptance_criteria;
create policy "project managers manage acceptance criteria" on public.acceptance_criteria
	for all using (public.is_project_manager()) with check (public.is_project_manager());

drop policy if exists "recipients read their notifications" on public.notifications;
create policy "recipients read their notifications" on public.notifications
	for select using (recipient_id = auth.uid());

drop policy if exists "recipients update their notifications" on public.notifications;
create policy "recipients update their notifications" on public.notifications
	for update using (recipient_id = auth.uid()) with check (recipient_id = auth.uid());

-- ============================================================================
-- Part 3: reload PostgREST's schema cache and verify.
-- ============================================================================

notify pgrst, 'reload schema';

-- You should see all 9 tables listed below. If any are missing, something above failed.
select table_name
from information_schema.tables
where table_schema = 'public'
	and table_name in ('projects', 'tasks', 'task_comments', 'phases', 'sprints',
		'task_assignees', 'task_roles', 'acceptance_criteria', 'notifications')
order by table_name;


-- ----------------------------------------------------------------------------
-- Later schema changes live as numbered files in migrations/ (0006 onwards).
-- This file is frozen: it rebuilds the original schema from any state, but is
-- no longer appended to — do not add new parts here.
-- ----------------------------------------------------------------------------
