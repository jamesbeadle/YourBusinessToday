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
