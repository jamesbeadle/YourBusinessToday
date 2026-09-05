import { getTask } from '$lib/server/projects/getTask';
import { noSuchTask } from './describeTask';
import { objectSchema, readText, textField } from '../actionTypes';
import { taskStatusLabels, taskStatusOrder } from '$lib/data/taskStatus';
import { updateTaskStatus } from '$lib/server/projects/updateTaskStatus';
import type { McpAction } from '../actionTypes';
import type { TaskStatus } from '$lib/data/taskStatus';

export const taskStatusActions: McpAction[] = [
	{
		name: 'update_task_status',
		area: 'tasks',
		audience: 'staff',
		isWrite: true,
		summary: 'move a task between backlog, in progress and done',
		guidance: 'Marking a task done takes it to 100 per cent, whatever it was before.',
		inputSchema: objectSchema(
			{ taskId: textField('The task id'), status: textField(taskStatusOrder.join(', ')) },
			['taskId', 'status']
		),
		run: async (caller, input) => {
			const task = await getTask(caller.supabase, readText(input, 'taskId'));
			if (task === null) return noSuchTask;
			const status = readStatus(input);
			if (status === null) return `A task is ${taskStatusOrder.join(', ')}. Pick one of those.`;
			await updateTaskStatus(caller.supabase, task.id, status);
			return `"${task.title}" is now ${taskStatusLabels[status]}.`;
		}
	}
];

function readStatus(input: Record<string, unknown>): TaskStatus | null {
	const status = readText(input, 'status');
	if (taskStatusOrder.includes(status as TaskStatus)) return status as TaskStatus;
	return null;
}
