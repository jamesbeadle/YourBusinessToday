import { describe, expect, it } from 'vitest';
import { parsePostcodeLocation } from './postcodeLocation';

describe('parsePostcodeLocation', () => {
	it('reads a postcodes.io result', () => {
		expect(
			parsePostcodeLocation({ postcode: 'GU1 3AA', outcode: 'GU1', latitude: 51.2, longitude: -0.57 })
		).toEqual({ postcode: 'GU1 3AA', outcode: 'GU1', latitude: 51.2, longitude: -0.57 });
	});

	it('rejects a result without coordinates', () => {
		expect(parsePostcodeLocation({ postcode: 'GU1 3AA' })).toBeNull();
	});
});
