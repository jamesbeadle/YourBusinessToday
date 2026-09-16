import { describe, expect, it } from 'vitest';
import {
	clampRank,
	orderByRank,
	withItemAtRank,
	withItemBeside,
	withItemMovedByOne
} from './rankedSet';

type Row = { id: string; rank: number | null };

const row = (id: string, rank: number | null): Row => ({ id, rank });
const readRank = (item: Row) => item.rank;
const idsOf = (items: Row[] | null) => items?.map((item) => item.id) ?? null;

const abcd = [row('a', 1), row('b', 2), row('c', 3), row('d', 4)];

describe('clampRank', () => {
	it('pulls a rank outside the set to its nearest end', () => {
		expect(clampRank(0, 4)).toBe(1);
		expect(clampRank(-3, 4)).toBe(1);
		expect(clampRank(99, 4)).toBe(4);
		expect(clampRank(2, 4)).toBe(2);
		expect(clampRank(5, 0)).toBe(1);
	});
});

describe('orderByRank', () => {
	it('sorts by rank and keeps unranked rows last in the order given', () => {
		const items = [row('c', 3), row('x', null), row('a', 1), row('y', null), row('b', 2)];
		expect(idsOf(orderByRank(items, readRank))).toEqual(['a', 'b', 'c', 'x', 'y']);
	});
});

describe('withItemAtRank', () => {
	it('lifts the row out and drops it at the rank, shifting the rest', () => {
		expect(idsOf(withItemAtRank(abcd, 'd', 2))).toEqual(['a', 'd', 'b', 'c']);
		expect(idsOf(withItemAtRank(abcd, 'a', 3))).toEqual(['b', 'c', 'a', 'd']);
	});

	it('treats a rank past either end as first or last', () => {
		expect(idsOf(withItemAtRank(abcd, 'c', 0))).toEqual(['c', 'a', 'b', 'd']);
		expect(idsOf(withItemAtRank(abcd, 'b', 40))).toEqual(['a', 'c', 'd', 'b']);
	});

	it('is a no-op for the rank it already holds and null for a stranger', () => {
		expect(idsOf(withItemAtRank(abcd, 'b', 2))).toEqual(['a', 'b', 'c', 'd']);
		expect(withItemAtRank(abcd, 'zz', 2)).toBeNull();
	});
});

describe('withItemMovedByOne', () => {
	it('swaps with the neighbour in that direction and stays put at the ends', () => {
		expect(idsOf(withItemMovedByOne(abcd, 'c', 'up'))).toEqual(['a', 'c', 'b', 'd']);
		expect(idsOf(withItemMovedByOne(abcd, 'c', 'down'))).toEqual(['a', 'b', 'd', 'c']);
		expect(idsOf(withItemMovedByOne(abcd, 'a', 'up'))).toEqual(['a', 'b', 'c', 'd']);
		expect(idsOf(withItemMovedByOne(abcd, 'd', 'down'))).toEqual(['a', 'b', 'c', 'd']);
	});
});

describe('withItemBeside', () => {
	it('places the row directly before or after the target', () => {
		expect(idsOf(withItemBeside(abcd, 'a', 'c', 'before'))).toEqual(['b', 'a', 'c', 'd']);
		expect(idsOf(withItemBeside(abcd, 'a', 'c', 'after'))).toEqual(['b', 'c', 'a', 'd']);
		expect(idsOf(withItemBeside(abcd, 'd', 'a', 'before'))).toEqual(['d', 'a', 'b', 'c']);
	});

	it('refuses a row beside itself or a target it cannot find', () => {
		expect(withItemBeside(abcd, 'a', 'a', 'before')).toBeNull();
		expect(withItemBeside(abcd, 'a', 'zz', 'after')).toBeNull();
	});
});
