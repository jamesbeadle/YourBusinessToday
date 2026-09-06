import { describe, expect, it } from 'vitest';
import { describeDistance, distanceInMiles } from './distance';

const guildford = { latitude: 51.2362, longitude: -0.5704 };
const woking = { latitude: 51.319, longitude: -0.558 };

describe('distanceInMiles', () => {
	it('measures Guildford to Woking as a little under six miles', () => {
		const miles = distanceInMiles(guildford, woking);
		expect(miles).toBeGreaterThan(5.6);
		expect(miles).toBeLessThan(5.9);
	});

	it('is zero from a place to itself', () => {
		expect(distanceInMiles(guildford, guildford)).toBe(0);
	});
});

describe('describeDistance', () => {
	it('rounds to a tenth of a mile', () => {
		expect(describeDistance(2.345)).toBe('2.3 mi');
	});

	it('calls anything under a tenth of a mile here', () => {
		expect(describeDistance(0.04)).toBe('here');
	});
});
