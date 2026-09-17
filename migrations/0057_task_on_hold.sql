-- 0057: a task can be on hold as well as backlog, in progress and done.
-- On hold is not done, so it still counts as open work everywhere.
-- Safe to re-run.

alter table public.tasks drop constraint if exists tasks_status_check;

alter table public.tasks add constraint tasks_status_check
	check (status in ('backlog', 'in_progress', 'on_hold', 'done'));

notify pgrst, 'reload schema';
