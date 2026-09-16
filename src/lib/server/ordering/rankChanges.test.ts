import { describe, expect, it } from 'vitest';
import { rankChanges, redealtRanks } from './rankChanges';

type Row = { id: string; rank: number | null };

const row = (id: string, rank: number | null): Row => ({ id, rank });
const readRank = (item: Row) => item.rank;

const abcd = [row('a', 1), row('b', 2), row('c', 3), row('d', 4)];

describe('rankChanges', () => {
	it('writes dense 1..n ranks and only for rows whose rank moves', () => {
		const gappy = [row('a', 1), row('b', 5), row('c', 6), row('d', null)];
		expect(rankChanges(gappy, readRank)).toEqual([
			{ id: 'b', rank: 2 },
			{ id: 'c', rank: 3 },
			{ id: 'd', rank: 4 }
		]);
		expect(rankChanges(abcd, readRank)).toEqual([]);
	});
});

describe('redealtRanks', () => {
	it('hands the same set of values out again in the new order, skipping unranked rows', () => {
		const siblings = [row('c', 9), row('a', 2), row('sub', null), row('b', 5)];
		expect(redealtRanks(siblings, readRank)).toEqual([
			{ id: 'c', rank: 2 },
			{ id: 'a', rank: 5 },
			{ id: 'b', rank: 9 }
		]);
	});
});
