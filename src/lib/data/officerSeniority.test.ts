import { describe, expect, it } from 'vitest';
import { seniorityForOfficerRole } from './officerSeniority';

describe('seniorityForOfficerRole', () => {
	it('ranks a director', () => {
		expect(seniorityForOfficerRole('director')).toBe('director');
	});

	it('ranks the register’s longer director roles', () => {
		expect(seniorityForOfficerRole('corporate-director')).toBe('director');
		expect(seniorityForOfficerRole('Nominee Director')).toBe('director');
	});

	it('leaves a secretary for staff to judge', () => {
		expect(seniorityForOfficerRole('secretary')).toBe('');
	});

	it('leaves an unnamed role unset', () => {
		expect(seniorityForOfficerRole('')).toBe('');
	});
});
