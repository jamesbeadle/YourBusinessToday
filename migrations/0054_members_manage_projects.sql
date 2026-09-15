-- 0054: everyone on a project manages it.
--
-- Being on a project stops meaning "work it but do not touch it". A member
-- renames it, changes its status, deletes it, and brings people on or takes
-- them off, exactly as the owner does. The one thing that stays with the
-- owner is handing the project on: transfer_project_ownership still checks
-- owns_project, and projects.owner_id remains the single truth of who owns it.
--
-- Run once, by hand, through scripts/run-migration.sh.

begin;

drop policy if exists "owners change their projects" on public.projects;
drop policy if exists "people change their projects" on public.projects;
create policy "people change their projects" on public.projects
	for update using (public.can_reach_project(id)) with check (public.can_reach_project(id));

drop policy if exists "owners delete their projects" on public.projects;
drop policy if exists "people delete their projects" on public.projects;
create policy "people delete their projects" on public.projects
	for delete using (public.can_reach_project(id));

drop policy if exists "owners manage who is on their projects" on public.project_members;
drop policy if exists "people manage who is on their projects" on public.project_members;
create policy "people manage who is on their projects" on public.project_members
	for all using (public.can_reach_project(project_id))
	with check (public.can_reach_project(project_id));

commit;

notify pgrst, 'reload schema';
