export type CompletionInput = { storyPoints: number; completionPercent: number };

export function weightedCompletionPercent(tasks: CompletionInput[]): number {
	const totalStoryPoints = sumStoryPoints(tasks);
	if (totalStoryPoints === 0) return 0;
	const earnedPoints = tasks.reduce(
		(sum, task) => sum + task.storyPoints * task.completionPercent,
		0
	);
	return Math.round(earnedPoints / totalStoryPoints);
}

function sumStoryPoints(tasks: CompletionInput[]): number {
	return tasks.reduce((sum, task) => sum + task.storyPoints, 0);
}
