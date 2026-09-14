import { getTask } from '$lib/server/projects/getTask';
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
import type { McpAction } from '../actionTypes';
import type { ProjectTask } from '$lib/server/projects/taskRecord';

const taskIdField = textField('The task id, as read_task_queue gives it');
const onlyTopLevelTasksQueue =
	'Only top level tasks sit in the queue. A subtask takes its order from its parent.';

export const taskQueueActions: McpAction[] = [
	{
		name: 'move_queued_task',
		area: 'tasks',
		audience: 'staff',
		isWrite: true,
		summary: 'move a task one place up or down the queue of work across every project',
		guidance:
			'The queue is what read_task_queue shows: top level tasks across all projects, in the ' +
			'order they will be worked. Done tasks are skipped over unless shouldIncludeDone is true.',
		inputSchema: objectSchema(
			{
				taskId: taskIdField,
				direction: directionField,
				shouldIncludeDone: {
					type: 'boolean',
					description: 'Count done tasks as neighbours'
				}
			},
			['taskId', 'direction']
		),
		run: async (caller, input) => {
			const task = await getTask(caller.supabase, readText(input, 'taskId'));
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
		audience: 'staff',
		isWrite: true,
		summary: 'place a task directly before or after another in the queue across every project',
		guidance:
			'Both tasks must be top level. The tasks may belong to different projects; this sets ' +
			'the order they are worked in, not where they live.',
		inputSchema: objectSchema(
			{
				taskId: taskIdField,
				targetTaskId: textField('The queued task to place it beside'),
				placement: besidePlacementField
			},
			['taskId', 'targetTaskId', 'placement']
		),
		run: async (caller, input) => {
			const task = await getTask(caller.supabase, readText(input, 'taskId'));
			const targetTask = await getTask(caller.supabase, readText(input, 'targetTaskId'));
			if (task === null || targetTask === null) return noSuchTask;
			if (!isQueued(task) || !isQueued(targetTask)) return onlyTopLevelTasksQueue;
			const placement = readBesidePlacement(input);
			if (placement === null) return sayWhichPlacement;
			await placeGlobalTask(caller.supabase, task.id, targetTask.id, placement);
			return `"${task.title}" is now queued ${placement} "${targetTask.title}".`;
		}
	}
];

function isQueued(task: ProjectTask): boolean {
	return task.parentTaskId === null && task.globalPriority !== null;
}
