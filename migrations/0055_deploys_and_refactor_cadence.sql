-- 0055: deploys and the refactor cadence.
--
-- A project knows which branch its deploys come from, how many deploys should
-- pass between refactor rounds (0 turns the cadence off), and when the last
-- round was raised. Every push to that branch the GitHub webhook reports lands
-- as one row in project_deploys, keyed by GitHub's delivery id so a redelivered
-- event counts once. Deploys since the last round are derived from the rows,
-- never stored. Safe to re-run.
--
-- Run once, by hand, through scripts/run-migration.sh.

begin;

alter table public.projects
	add column if not exists default_branch text not null default 'main',
	add column if not exists refactor_every_deploys integer not null default 10,
	add column if not exists last_refactor_raised_at timestamptz;

alter table public.projects drop constraint if exists projects_refactor_every_deploys_check;
alter table public.projects add constraint projects_refactor_every_deploys_check
	check (refactor_every_deploys >= 0);

create table if not exists public.project_deploys (
	id uuid primary key default gen_random_uuid(),
	project_id uuid not null references public.projects (id) on delete cascade,
	delivery_id text not null,
	commit_sha text not null default '',
	branch text not null,
	pushed_at timestamptz not null default now(),
	received_at timestamptz not null default now(),
	unique (project_id, delivery_id)
);

create index if not exists project_deploys_by_project_time
	on public.project_deploys (project_id, pushed_at);

alter table public.project_deploys enable row level security;

drop policy if exists "people read deploys on their projects" on public.project_deploys;
create policy "people read deploys on their projects" on public.project_deploys
	for select using (public.can_reach_project(project_id));

commit;

notify pgrst, 'reload schema';
