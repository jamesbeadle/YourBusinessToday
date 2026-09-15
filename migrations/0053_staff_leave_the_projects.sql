-- 0053: staff stop seeing every project.
--
-- Apply only once the owner-and-team code from 0052 is live. Until then the
-- site still reads projects through the staff-wide policies below. After it,
-- being staff means the clients register and admin — not other people's work.
--
-- Run once, by hand, through scripts/run-migration.sh.

begin;

drop policy if exists "project managers manage projects" on public.projects;
drop policy if exists "project managers read project members" on public.project_members;
drop policy if exists "administrators manage project members" on public.project_members;
drop policy if exists "project managers manage goals" on public.goals;
drop policy if exists "project managers manage tasks" on public.tasks;
drop policy if exists "project managers manage acceptance criteria" on public.acceptance_criteria;
drop policy if exists "project managers manage task checklists" on public.task_checklists;
drop policy if exists "project managers manage checklist items" on public.task_checklist_items;
drop policy if exists "project managers manage task attachments" on public.task_attachments;
drop policy if exists "project managers manage task assignees" on public.task_assignees;
drop policy if exists "project managers manage task roles" on public.task_roles;
drop policy if exists "project managers manage messages" on public.conversation_messages;
drop policy if exists "project managers add task attachment files" on storage.objects;
drop policy if exists "project managers read task attachment files" on storage.objects;
drop policy if exists "project managers remove task attachment files" on storage.objects;

-- Client access tokens were the contact's way into the MCP; everyone now
-- connects through OAuth as themselves.
drop table if exists public.client_api_tokens;

commit;

notify pgrst, 'reload schema';
