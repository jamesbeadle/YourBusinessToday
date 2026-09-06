import { describe, expect, it } from 'vitest';
import { outcodeOf, postcodeIn } from './postcode';

describe('postcodeIn', () => {
	it('upper-cases and puts one space before the inward code', () => {
		expect(postcodeIn('gu13aa')).toBe('GU1 3AA');
		expect(postcodeIn('  sw1a  1aa ')).toBe('SW1A 1AA');
	});

	it('finds the postcode inside an address line', () => {
		expect(postcodeIn('1 High Street, Guildford, GU1 3AA')).toBe('GU1 3AA');
	});

	it('returns nothing for text that is not a postcode', () => {
		expect(postcodeIn('Guildford')).toBe('');
	});
});

describe('outcodeOf', () => {
	it('is the part before the space', () => {
		expect(outcodeOf('GU1 3AA')).toBe('GU1');
	});
});
