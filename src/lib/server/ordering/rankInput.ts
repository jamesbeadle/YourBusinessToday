import type { DropPlacement, MoveDirection } from './rankedSet';

export function parseDropPlacement(value: unknown): DropPlacement {
	if (value === 'after' || value === 'inside') return value;
	return 'before';
}

export function parseMoveDirection(value: unknown): MoveDirection | null {
	if (value === 'up' || value === 'down') return value;
	return null;
}

/** A rank as typed or spoken: a whole number, or null when it is not one. */
export function parseRank(value: unknown): number | null {
	if (value === null || value === undefined || value === '') return null;
	const rank = Number(value);
	if (!Number.isInteger(rank)) return null;
	return rank;
}
