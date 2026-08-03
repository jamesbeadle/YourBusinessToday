# Project Management Setup

Internal project management for the team: projects, prioritised task backlogs, due dates,
assignees, and comments — visible only to staff and admins.

## One-time database setup

Run [`docs/sql/project-management.sql`](./sql/project-management.sql) once in the Supabase
SQL editor. It:

- adds `is_staff` and `display_name` to `profiles`, and sets `is_admin` for
  `jamesbeadle1989@gmail.com` (the profile must already exist — sign in with Google once
  first);
- creates `projects`, `tasks`, and `task_comments` with row-level security that admits
  staff and admins only (restricted accounts are excluded even if flagged staff);
- creates the functions the app calls: `admin_set_staff`, `admin_list_staff_flags`,
  `staff_directory`, and `set_display_name`.

## How access works

- **Admin** (`is_admin`) — everything staff can do, plus `/admin`, where the
  "Make staff" / "Remove staff" button flips `is_staff` for any account.
- **Staff** (`is_staff`) — sees the Projects link in the header and has full access to
  `/projects`. All staff share one workspace: everyone sees and edits every project.
- Everyone else — no Projects link; visiting `/projects` redirects home.

## The views

- `/projects` — create projects, see open-task counts, archive finished ones.
- `/projects/[projectId]` — the prioritised backlog. New tasks join the bottom; the
  ▲ ▼ controls reorder, so the top row is always the next thing to spend Claude on.
  The status pill cycles Backlog → In progress → Done in place.
- `/projects/[projectId]/tasks/[taskId]` — full task editing (title, details, status,
  due date, assignee) and the comment thread.
- `/account` — set the display name shown on assignments and comments.

## Priority model

Priority is a per-project integer; the list is always ordered by it. Moving a task swaps
its priority with its neighbour, so reordering never renumbers the whole backlog.
