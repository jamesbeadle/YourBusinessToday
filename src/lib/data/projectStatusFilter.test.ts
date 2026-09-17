import { describe, expect, it } from 'vitest';
import {
	matchesProjectStatusFilter,
	projectStatusFilterLabel,
	projectStatusFilterOrder
} from './projectStatusFilter';

describe('the project status filter', () => {
	it('counts every project that is not complete as open', () => {
		expect(matchesProjectStatusFilter('scoping', 'open')).toBe(true);
		expect(matchesProjectStatusFilter('building', 'open')).toBe(true);
		expect(matchesProjectStatusFilter('on_hold', 'open')).toBe(true);
		expect(matchesProjectStatusFilter('complete', 'open')).toBe(false);
	});

	it('keeps every project under all', () => {
		expect(matchesProjectStatusFilter('complete', 'all')).toBe(true);
		expect(matchesProjectStatusFilter('on_hold', 'all')).toBe(true);
	});

	it('keeps only its own status under a status chip', () => {
		expect(matchesProjectStatusFilter('on_hold', 'on_hold')).toBe(true);
		expect(matchesProjectStatusFilter('building', 'on_hold')).toBe(false);
	});

	it('offers open and all before the statuses, on hold among them', () => {
		expect(projectStatusFilterOrder.slice(0, 2)).toEqual(['open', 'all']);
		expect(projectStatusFilterOrder).toContain('on_hold');
	});

	it('labels each chip in plain words', () => {
		expect(projectStatusFilterLabel('open')).toBe('Open');
		expect(projectStatusFilterLabel('all')).toBe('All');
		expect(projectStatusFilterLabel('on_hold')).toBe('On hold');
	});
});
