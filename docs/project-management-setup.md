# Project Management Setup

Internal project management for the team: projects, phases, sprints, prioritised task
backlogs, user stories with acceptance criteria, story points, completion tracking,
due dates, multiple assignees and roles, comments, and in-app notifications — visible
only to staff and admins.

## One-time database setup

Run these in the Supabase SQL editor, in order (each is run-once):

1. [`docs/sql/project-management.sql`](./sql/project-management.sql) — staff flags,
   `projects`, `tasks`, `task_comments`, and the access functions.
2. [`docs/sql/project-management-upgrade.sql`](./sql/project-management-upgrade.sql) —
   `phases`, `sprints`, `task_assignees`, `task_roles`, `acceptance_criteria`, and
   `notifications`, plus the new task columns (story points, completion, user story
   fields). Existing single assignees migrate into `task_assignees` and the old
   `assignee_id` column is dropped. A database trigger raises a notification for every
   assignee (except the author) when a comment lands on their task.

## How access works

- **Admin** (`is_admin`) — everything staff can do, plus `/admin`, where the
  "Make staff" / "Remove staff" button flips `is_staff` for any account.
- **Staff** (`is_staff`) — sees the Projects link in the header and has full access to
  `/projects`. All staff share one workspace: everyone sees and edits every project.
- Everyone else — no Projects link; visiting `/projects` redirects home.
- Notifications are personal: each account only ever sees its own.

## The views

- `/projects` — create projects, see open-task counts, archive finished ones.
- `/projects/[projectId]` — phases (with weighted completion bars and an add-phase form)
  above the prioritised backlog. New tasks join the bottom; the ▲ ▼ controls reorder, so
  the top row is always the next thing to spend Claude on. Each row shows its phase,
  assignees, story points, and completion; the status pill cycles
  Backlog → In progress → Done in place.
- `/projects/[projectId]/sprints` — create sprints (with optional start and end dates)
  and see each sprint's task count and weighted completion.
- `/projects/[projectId]/sprints/[sprintId]` — the tasks in a sprint, drawn from any
  phase, in backlog priority order.
- `/projects/[projectId]/tasks/[taskId]` — full task editing: title, details, status,
  due date, phase, sprint, Fibonacci story points (1 2 3 5 8 13 21, default 2),
  completion %, the user-story fields, assignees, and roles — plus acceptance criteria
  and the comment thread.
- `/notifications` — comments on tasks assigned to you, newest first, with unread
  markers; the header bell shows the unread count.
- `/account` — set the display name shown on assignments and comments.

## The models

- **Priority** is a per-project integer; the backlog is always ordered by it. Moving a
  task swaps its priority with its neighbour, so reordering never renumbers the backlog.
- **Completion** is a manual 0–100 % on each task. Phase and sprint percentages are
  derived, weighted by story points, so a 5-point task moves the bar more than a
  1-point one. Marking a task done sets it to 100 %.
- **User stories** — any task can become one: *as* a role, *I want* a feature,
  *so that* a benefit. Stories are marked ◆ in lists and carry acceptance criteria,
  each of which can be checked off as met.
- **Sprints** cut across phases: a sprint is any set of the project's tasks, whatever
  stage they belong to.
- **Roles** come from the fixed list in `src/lib/data/taskRoles.ts` — edit that file to
  change the roles on offer.
