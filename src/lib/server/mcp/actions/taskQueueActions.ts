import { reachableTask } from '../projectAccess';
import { isQueued } from '$lib/server/projects/taskQueue';
import { moveGlobalTask } from '$lib/server/projects/moveGlobalTask';
import { noSuchTask } from './describeTask';
import { objectSchema, readText, textField } from '../actionTypes';
import { placeGlobalTask } from '$lib/server/projects/placeGlobalTask';
import {
	besidePlacementField,
	directionField,
	readBesidePlacement,
	readMoveDirection,
	sayWhichDirection,
	sayWhichPlacement
} from './orderingFields';
import { onlyTopLevelTasksQueue, queuedTaskIdField } from './queueFields';
import { taskQueuePriorityActions } from './taskQueuePriorityActions';
import type { McpAction } from '../actionTypes';

export const taskQueueActions: McpAction[] = [
	...taskQueuePriorityActions,
	{
		name: 'move_queued_task',
		area: 'tasks',
		audience: 'everyone',
		isWrite: true,
		summary: 'move a task one place up or down the queue of work across every project',
		guidance:
			'Done tasks are skipped over unless shouldIncludeDone is true. To give it a particular ' +
			'position in one call, use set_task_queue_priority.',
		inputSchema: objectSchema(
			{
				taskId: queuedTaskIdField,
				direction: directionField,
				shouldIncludeDone: { type: 'boolean', description: 'Count done tasks as neighbours' }
			},
			['taskId', 'direction']
		),
		run: async (caller, input) => {
			const task = await reachableTask(caller, readText(input, 'taskId'));
			if (task === null) return noSuchTask;
			if (!isQueued(task)) return onlyTopLevelTasksQueue;
			const direction = readMoveDirection(input);
			if (direction === null) return sayWhichDirection;
			await moveGlobalTask(caller.supabase, task.id, direction, input.shouldIncludeDone === true);
			return `"${task.title}" moved ${direction} the queue.`;
		}
	},
	{
		name: 'place_queued_task',
		area: 'tasks',
		audience: 'everyone',
		isWrite: true,
		summary: 'place a task directly before or after another in the queue across every project',
		guidance:
			'Both tasks must be top level. The tasks may belong to different projects; this sets ' +
			'the order they are worked in, not where they live.',
		inputSchema: objectSchema(
			{
				taskId: queuedTaskIdField,
				targetTaskId: textField('The queued task to place it beside'),
				placement: besidePlacementField
			},
			['taskId', 'targetTaskId', 'placement']
		),
		run: async (caller, input) => {
			const task = await reachableTask(caller, readText(input, 'taskId'));
			const targetTask = await reachableTask(caller, readText(input, 'targetTaskId'));
			if (task === null || targetTask === null) return noSuchTask;
			if (!isQueued(task) || !isQueued(targetTask)) return onlyTopLevelTasksQueue;
			const placement = readBesidePlacement(input);
			if (placement === null) return sayWhichPlacement;
			await placeGlobalTask(caller.supabase, task.id, targetTask.id, placement);
			return `"${task.title}" is now queued ${placement} "${targetTask.title}".`;
		}
	}
];
