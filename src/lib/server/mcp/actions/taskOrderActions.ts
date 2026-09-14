import { getTask } from '$lib/server/projects/getTask';
import { moveTask } from '$lib/server/projects/moveTask';
import { noSuchTask } from './describeTask';
import { objectSchema, readText, textField } from '../actionTypes';
import { placeTask } from '$lib/server/projects/placeTask';
import {
	besidePlacementField,
	directionField,
	readBesidePlacement,
	readMoveDirection,
	sayWhichDirection,
	sayWhichPlacement
} from './orderingFields';
import type { McpAction } from '../actionTypes';

const taskIdField = textField('The task id');
const bothTasksNeeded = 'Name the task to move and the task to place it beside.';

export const taskOrderActions: McpAction[] = [
	{
		name: 'move_task',
		area: 'tasks',
		audience: 'staff',
		isWrite: true,
		summary: 'move a task one place up or down among the tasks beside it',
		guidance:
			'Order is priority: the top task is worked first. This swaps the task with its ' +
			'neighbour at the same level of the project. To jump several places, call place_task.',
		inputSchema: objectSchema({ taskId: taskIdField, direction: directionField }, [
			'taskId',
			'direction'
		]),
		run: async (caller, input) => {
			const task = await getTask(caller.supabase, readText(input, 'taskId'));
			if (task === null) return noSuchTask;
			const direction = readMoveDirection(input);
			if (direction === null) return sayWhichDirection;
			await moveTask(caller.supabase, task.id, direction);
			return `"${task.title}" moved ${direction}.`;
		}
	},
	{
		name: 'place_task',
		area: 'tasks',
		audience: 'staff',
		isWrite: true,
		summary: 'place a task directly before or after another task in the same project',
		guidance:
			'Use this to set priority in one call: everything between the two tasks shifts to make ' +
			'room. If the target sits under a different parent or goal, the moved task joins it there.',
		inputSchema: objectSchema(
			{
				taskId: taskIdField,
				targetTaskId: textField('The task to place it beside'),
				placement: besidePlacementField
			},
			['taskId', 'targetTaskId', 'placement']
		),
		run: async (caller, input) => {
			const task = await getTask(caller.supabase, readText(input, 'taskId'));
			const targetTask = await getTask(caller.supabase, readText(input, 'targetTaskId'));
			if (task === null || targetTask === null) return bothTasksNeeded;
			if (task.projectId !== targetTask.projectId) return 'Both tasks must be on one project.';
			const placement = readBesidePlacement(input);
			if (placement === null) return sayWhichPlacement;
			await placeTask(caller.supabase, task.id, targetTask.id, placement);
			return `"${task.title}" now sits ${placement} "${targetTask.title}".`;
		}
	}
];
