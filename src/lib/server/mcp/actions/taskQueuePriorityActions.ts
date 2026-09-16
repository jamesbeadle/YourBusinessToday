import { ownsProject, reachableTask } from '../projectAccess';
import { isQueued } from '$lib/server/projects/taskQueue';
import { noSuchTask } from './describeTask';
import { objectSchema, readText } from '../actionTypes';
import { onlyTopLevelTasksQueue, queuedTaskIdField } from './queueFields';
import { priorityField, readPriority, sayWhichPriority } from './orderingFields';
import { setQueuePriority } from '$lib/server/projects/setQueuePriority';
import type { McpAction } from '../actionTypes';

const onlyTheOwnerQueues = 'The queue belongs to the project owner; only they can reorder it.';

export const taskQueuePriorityActions: McpAction[] = [
	{
		name: 'set_task_queue_priority',
		area: 'tasks',
		audience: 'everyone',
		isWrite: true,
		summary:
			'give a task a position in your queue across every project — the others shift to make room',
		guidance:
			'The queue is what read_task_queue shows, numbered by position; done tasks keep theirs, ' +
			'so the numbers shown may skip. Setting a position also keeps the task’s own ' +
			'project in the same order.',
		inputSchema: objectSchema(
			{ taskId: queuedTaskIdField, priority: priorityField('of the queue') },
			['taskId', 'priority']
		),
		run: async (caller, input) => {
			const task = await reachableTask(caller, readText(input, 'taskId'));
			if (task === null) return noSuchTask;
			if (!isQueued(task)) return onlyTopLevelTasksQueue;
			if (!ownsProject(caller, task.projectId)) return onlyTheOwnerQueues;
			const priority = readPriority(input);
			if (priority === null) return sayWhichPriority;
			await setQueuePriority(caller.supabase, task.id, priority);
			return `"${task.title}" is now position ${priority} in your queue.`;
		}
	}
];
