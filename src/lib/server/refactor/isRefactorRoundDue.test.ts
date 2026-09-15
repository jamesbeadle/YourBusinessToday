import { describe, expect, it } from 'vitest';
import { describeRefactorCadence, isRefactorRoundDue } from './isRefactorRoundDue';

describe('isRefactorRoundDue', () => {
	it('is due at the cadence and beyond it', () => {
		expect(isRefactorRoundDue({ refactorEveryDeploys: 10, deploysSinceRefactor: 10, hasOpenRound: false })).toBe(true);
		expect(isRefactorRoundDue({ refactorEveryDeploys: 10, deploysSinceRefactor: 14, hasOpenRound: false })).toBe(true);
	});

	it('is not due before the cadence is reached', () => {
		expect(isRefactorRoundDue({ refactorEveryDeploys: 10, deploysSinceRefactor: 9, hasOpenRound: false })).toBe(false);
	});

	it('never raises a second round while one is open', () => {
		expect(isRefactorRoundDue({ refactorEveryDeploys: 10, deploysSinceRefactor: 30, hasOpenRound: true })).toBe(false);
	});

	it('is never due when the cadence is off', () => {
		expect(isRefactorRoundDue({ refactorEveryDeploys: 0, deploysSinceRefactor: 100, hasOpenRound: false })).toBe(false);
	});

	it('reads as a sentence on the project', () => {
		expect(describeRefactorCadence({ refactorEveryDeploys: 10, deploysSinceRefactor: 7 })).toBe(
			'7 of 10 deploys since the last refactor round.'
		);
		expect(describeRefactorCadence({ refactorEveryDeploys: 0, deploysSinceRefactor: 7 })).toBe(
			'Refactor rounds are off for this project.'
		);
	});
});
