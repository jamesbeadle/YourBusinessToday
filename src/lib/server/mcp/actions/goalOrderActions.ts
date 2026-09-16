import { reachableGoal } from '../projectAccess';
import { goalIdField } from './goalReadActions';
import { noSuchGoal } from './describeGoal';
import { objectSchema, readText } from '../actionTypes';
import { priorityField, readPriority, sayWhichPriority } from './orderingFields';
import { setGoalPriority } from '$lib/server/goals/setGoalPriority';
import type { McpAction } from '../actionTypes';

export const goalOrderActions: McpAction[] = [
	{
		name: 'set_goal_priority',
		area: 'goals',
		audience: 'everyone',
		isWrite: true,
		summary: 'give a goal a priority number among its project’s goals — the others shift to make room',
		guidance:
			'Goals are in priority order on the project: 1 is what the project is for above all ' +
			'else. find_goals and read_project show each goal’s number.',
		inputSchema: objectSchema({ goalId: goalIdField, priority: priorityField('goal') }, [
			'goalId',
			'priority'
		]),
		run: async (caller, input) => {
			const goal = await reachableGoal(caller, readText(input, 'goalId'));
			if (goal === null) return noSuchGoal;
			const priority = readPriority(input);
			if (priority === null) return sayWhichPriority;
			await setGoalPriority(caller.supabase, goal.id, priority);
			return `"${goal.title}" is now priority ${priority} on the project.`;
		}
	}
];
