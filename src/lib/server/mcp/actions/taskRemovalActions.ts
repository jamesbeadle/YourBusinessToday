import { reachableTask } from '../projectAccess';
import { deleteTask } from '$lib/server/projects/deleteTask';
import { getSubtasks } from '$lib/server/projects/getSubtasks';
import { noSuchTask } from './describeTask';
import { objectSchema, readText, textField } from '../actionTypes';
import type { McpAction } from '../actionTypes';

export const taskRemovalActions: McpAction[] = [
	{
		name: 'delete_task',
		area: 'tasks',
		audience: 'everyone',
		isWrite: true,
		summary: 'delete a task and every subtask, criterion, checklist, attachment and message on it',
		guidance:
			'This cannot be undone and takes the subtasks with it. Read the task first and confirm ' +
			'with the person before calling it. Finished work is marked done, not deleted.',
		inputSchema: objectSchema({ taskId: textField('The task id') }, ['taskId']),
		run: async (caller, input) => {
			const task = await reachableTask(caller, readText(input, 'taskId'));
			if (task === null) return noSuchTask;
			const subtasks = await getSubtasks(caller.supabase, task.id);
			await deleteTask(caller.supabase, task.id);
			return `"${task.title}" deleted${withSubtasks(subtasks.length)}.`;
		}
	}
];

function withSubtasks(subtaskCount: number): string {
	if (subtaskCount === 0) return '';
	if (subtaskCount === 1) return ', along with its one subtask';
	return `, along with its ${subtaskCount} subtasks`;
}
