import { describe, expect, it } from 'vitest';
import { parseRank } from './rankInput';

describe('parseRank', () => {
	it('reads whole numbers however they arrive and nothing else', () => {
		expect(parseRank('3')).toBe(3);
		expect(parseRank(3)).toBe(3);
		expect(parseRank('')).toBeNull();
		expect(parseRank('2.5')).toBeNull();
		expect(parseRank('top')).toBeNull();
		expect(parseRank(undefined)).toBeNull();
	});
});
