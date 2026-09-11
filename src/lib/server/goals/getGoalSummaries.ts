import type { Goal } from './goalRecord';
import type { ProjectTask } from '$lib/server/projects/taskRecord';

export type GoalSummary = Goal & {
	taskCount: number;
	doneTaskCount: number;
	awaitingAnswerCount: number;
};

export function getGoalSummaries(goals: Goal[], tasks: ProjectTask[]): GoalSummary[] {
	return goals.map((goal) => summariseGoal(goal, tasks.filter((task) => task.goalId === goal.id)));
}

function summariseGoal(goal: Goal, goalTasks: ProjectTask[]): GoalSummary {
	return {
		...goal,
		taskCount: goalTasks.length,
		doneTaskCount: goalTasks.filter((task) => task.status === 'done').length,
		awaitingAnswerCount: goalTasks.filter(
			(task) => task.kind === 'support' && task.status === 'backlog'
		).length
	};
}
