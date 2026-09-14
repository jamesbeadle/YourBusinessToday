import { getTask } from '$lib/server/projects/getTask';
import { noSuchTask } from './describeTask';
import { objectSchema, readOptionalText, readText, textField } from '../actionTypes';
import { reparentTask } from '$lib/server/projects/reparentTask';
import type { McpAction } from '../actionTypes';
import type { ProjectTask } from '$lib/server/projects/taskRecord';
import type { SupabaseClient } from '@supabase/supabase-js';

export const taskParentActions: McpAction[] = [
	{
		name: 'set_task_parent',
		area: 'tasks',
		audience: 'staff',
		isWrite: true,
		summary: 'make a task a subtask of another, or bring it up to the top level of the project',
		guidance:
			'Leave parentTaskId out to bring the task to the top level, where it joins the queue of ' +
			'work. A task cannot go under itself or under one of its own subtasks, and it cannot ' +
			'move to another project. The task lands at the end of its new siblings.',
		inputSchema: objectSchema(
			{
				taskId: textField('The task id'),
				parentTaskId: textField('The task it should sit under — omit for the top level')
			},
			['taskId']
		),
		run: async (caller, input) => {
			const task = await getTask(caller.supabase, readText(input, 'taskId'));
			if (task === null) return noSuchTask;
			const parentTaskId = readOptionalText(input, 'parentTaskId');
			if (parentTaskId === null) return bringToTopLevel(caller.supabase, task);
			const parentTask = await getTask(caller.supabase, parentTaskId);
			if (parentTask === null) return 'No task has that parent id.';
			if (parentTask.projectId !== task.projectId) return 'Both tasks must be on one project.';
			return nestUnder(caller.supabase, task, parentTask);
		}
	}
];

async function bringToTopLevel(supabase: SupabaseClient, task: ProjectTask): Promise<string> {
	if (task.parentTaskId === null) return `"${task.title}" is already at the top level.`;
	await reparentTask(supabase, task.id, null);
	return `"${task.title}" is now at the top level.`;
}

async function nestUnder(
	supabase: SupabaseClient,
	task: ProjectTask,
	parentTask: ProjectTask
): Promise<string> {
	await reparentTask(supabase, task.id, parentTask.id);
	const movedTask = await getTask(supabase, task.id);
	if (movedTask?.parentTaskId !== parentTask.id) {
		return `"${task.title}" cannot go there — a task cannot sit under one of its own subtasks.`;
	}
	return `"${task.title}" is now a subtask of "${parentTask.title}".`;
}
