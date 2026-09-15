import type { ProjectTask } from '$lib/server/projects/taskRecord';

export const refactorRoundTitlePrefix = 'REFACTOR: round';

const roundNumberPattern = /^REFACTOR: round (\d+)\b/;

export function refactorRoundTitle(roundNumber: number): string {
	return `${refactorRoundTitlePrefix} ${roundNumber}`;
}

export function isRefactorRound(task: Pick<ProjectTask, 'title'>): boolean {
	return roundNumberPattern.test(task.title);
}

export function roundNumberOf(task: Pick<ProjectTask, 'title'>): number | null {
	const match = roundNumberPattern.exec(task.title);
	if (match === null) return null;
	return Number(match[1]);
}

/** The next round is one past the highest round ever raised on the project, whatever became of the earlier ones. */
export function nextRoundNumber(tasks: Pick<ProjectTask, 'title'>[]): number {
	const highest = tasks
		.map(roundNumberOf)
		.filter((roundNumber): roundNumber is number => roundNumber !== null)
		.reduce((best, roundNumber) => Math.max(best, roundNumber), 0);
	return highest + 1;
}

export function openRefactorRound(tasks: ProjectTask[]): ProjectTask | null {
	return tasks.find((task) => isRefactorRound(task) && task.status !== 'done') ?? null;
}
