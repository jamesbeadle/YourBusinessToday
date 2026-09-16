import { topRank } from './rankedSet';

export type RankChange = { id: string; rank: number };

/** Dense ranks 1..n for the given order — only the rows whose rank changes. */
export function rankChanges<Item extends { id: string }>(
	itemsInOrder: Item[],
	readRank: (item: Item) => number | null
): RankChange[] {
	return itemsInOrder
		.map((item, index) => ({ id: item.id, rank: index + topRank, currentRank: readRank(item) }))
		.filter((entry) => entry.currentRank !== entry.rank)
		.map((entry) => ({ id: entry.id, rank: entry.rank }));
}

/**
 * A secondary rank (the queue position of top level tasks) is not renumbered
 * when siblings reorder: the same set of values is dealt out again in the new
 * order, so the queue keeps its shape and only these rows swap places in it.
 */
export function redealtRanks<Item extends { id: string }>(
	itemsInOrder: Item[],
	readRank: (item: Item) => number | null
): RankChange[] {
	const orderedValues = itemsInOrder
		.map(readRank)
		.filter((value): value is number => value !== null)
		.sort((firstValue, secondValue) => firstValue - secondValue);
	const changes: RankChange[] = [];
	let nextValueIndex = 0;
	for (const item of itemsInOrder) {
		const currentValue = readRank(item);
		if (currentValue === null) continue;
		const redealtValue = orderedValues[nextValueIndex];
		nextValueIndex += 1;
		if (redealtValue !== currentValue) changes.push({ id: item.id, rank: redealtValue });
	}
	return changes;
}
