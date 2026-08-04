import { weightedCompletionPercent } from '$lib/data/completionSummary';
import type { Sprint } from '$lib/server/projects/sprintRecord';
import type { ProjectTask } from '$lib/server/projects/taskRecord';

export type SprintSummary = Sprint & { completionPercent: number; taskCount: number };

export function getSprintSummaries(sprints: Sprint[], tasks: ProjectTask[]): SprintSummary[] {
	return sprints.map((sprint) => summariseSprint(sprint, tasks));
}

function summariseSprint(sprint: Sprint, tasks: ProjectTask[]): SprintSummary {
	const sprintTasks = tasks.filter((task) => task.sprintId === sprint.id);
	return {
		...sprint,
		completionPercent: weightedCompletionPercent(sprintTasks),
		taskCount: sprintTasks.length
	};
}
