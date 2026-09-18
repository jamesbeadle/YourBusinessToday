import type { GoalSummary } from '$lib/server/goals/getGoalSummaries';

export function openGoalsOnly(goalSummaries: GoalSummary[]): GoalSummary[] {
	return goalSummaries.filter((goalSummary) => goalSummary.status === 'open');
}
