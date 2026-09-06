import { describe, expect, it } from 'vitest';
import { displayNameFromRegisterName, displayNameFromSearchTitle, surnameOf } from './officerName';

describe('officer names', () => {
	it('puts the forenames before the surname', () => {
		expect(displayNameFromRegisterName('SMITH, Jane Elizabeth')).toBe('Jane Elizabeth Smith');
	});

	it('copes with a register name that has no comma', () => {
		expect(displayNameFromRegisterName('ACME NOMINEES LIMITED')).toBe('Acme Nominees Limited');
	});

	it('tidies the capitals in a search title', () => {
		expect(displayNameFromSearchTitle('Jane SMITH')).toBe('Jane Smith');
	});

	it('takes the last word as the surname', () => {
		expect(surnameOf('Jane Elizabeth Smith')).toBe('Smith');
		expect(surnameOf('')).toBe('');
	});
});
