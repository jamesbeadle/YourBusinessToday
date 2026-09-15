import { describe, expect, it } from 'vitest';
import {
	isRefactorRound,
	nextRoundNumber,
	openRefactorRound,
	refactorRoundTitle,
	roundNumberOf
} from './refactorRoundTitle';
import type { ProjectTask } from '$lib/server/projects/taskRecord';

const task = (title: string, status: ProjectTask['status'] = 'backlog'): ProjectTask =>
	({ title, status }) as ProjectTask;

describe('refactor round titles', () => {
	it('names a round by its number and reads it back', () => {
		expect(refactorRoundTitle(3)).toBe('REFACTOR: round 3');
		expect(roundNumberOf(task('REFACTOR: round 12 — the Sales pages'))).toBe(12);
		expect(roundNumberOf(task('FIX: round trip fails'))).toBeNull();
	});

	it('is one past the highest round ever raised, done or not', () => {
		expect(nextRoundNumber([])).toBe(1);
		expect(
			nextRoundNumber([task('REFACTOR: round 1', 'done'), task('REFACTOR: round 4', 'done'), task('Add a thing')])
		).toBe(5);
	});

	it('finds the round still open and ignores finished ones', () => {
		expect(openRefactorRound([task('REFACTOR: round 1', 'done')])).toBeNull();
		const open = task('REFACTOR: round 2', 'in_progress');
		expect(openRefactorRound([task('REFACTOR: round 1', 'done'), open])).toBe(open);
		expect(isRefactorRound(task('Refactor the thing'))).toBe(false);
	});
});
