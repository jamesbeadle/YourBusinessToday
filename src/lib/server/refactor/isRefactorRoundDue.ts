export type CadenceReading = {
	refactorEveryDeploys: number;
	deploysSinceRefactor: number;
	hasOpenRound: boolean;
};

/** The one rule: a round is due when the cadence is on, enough deploys have landed, and no round is still open. */
export function isRefactorRoundDue(reading: CadenceReading): boolean {
	if (reading.refactorEveryDeploys <= 0) return false;
	if (reading.hasOpenRound) return false;
	return reading.deploysSinceRefactor >= reading.refactorEveryDeploys;
}

export function describeRefactorCadence(reading: Omit<CadenceReading, 'hasOpenRound'>): string {
	if (reading.refactorEveryDeploys <= 0) return 'Refactor rounds are off for this project.';
	return `${reading.deploysSinceRefactor} of ${reading.refactorEveryDeploys} deploys since the last refactor round.`;
}
