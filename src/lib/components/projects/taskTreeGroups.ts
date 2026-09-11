import type { Goal } from '$lib/server/goals/goalRecord';
import type { TaskTreeNode } from '$lib/server/projects/buildTaskTree';

export type TaskGroup = { goal: Goal | null; tasks: TaskTreeNode[] };

export function groupTasksByGoal(tasks: TaskTreeNode[], goals: Goal[]): TaskGroup[] {
	const underGoals = goals.map((goal) => ({
		goal,
		tasks: tasks.filter((task) => task.goalId === goal.id)
	}));
	const goalIds = new Set(goals.map((goal) => goal.id));
	const outsideGoals = tasks.filter((task) => task.goalId === null || !goalIds.has(task.goalId));
	return [...underGoals, { goal: null, tasks: outsideGoals }].filter((group) => group.tasks.length > 0);
}
