import { describe, expect, it } from 'vitest';
import { isAwaitingAnswer, parseTaskKind, taskStatusLabelFor } from './taskKind';

describe('taskStatusLabelFor', () => {
	it('reads a support task as a question with an answer', () => {
		expect(taskStatusLabelFor('support', 'backlog')).toBe('Awaiting answer');
		expect(taskStatusLabelFor('support', 'done')).toBe('Resolved');
	});

	it('leaves work tasks as they were', () => {
		expect(taskStatusLabelFor('work', 'backlog')).toBe('Backlog');
	});
});

describe('isAwaitingAnswer', () => {
	it('is only a support task nobody has picked up', () => {
		expect(isAwaitingAnswer('support', 'backlog')).toBe(true);
		expect(isAwaitingAnswer('support', 'in_progress')).toBe(false);
		expect(isAwaitingAnswer('work', 'backlog')).toBe(false);
	});
});

describe('parseTaskKind', () => {
	it('treats anything but support as work', () => {
		expect(parseTaskKind('support')).toBe('support');
		expect(parseTaskKind('feature')).toBe('work');
		expect(parseTaskKind(null)).toBe('work');
	});
});
