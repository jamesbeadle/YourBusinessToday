import {
	orderByRank,
	withItemAtRank,
	withItemBeside,
	withItemMovedByOne,
	type BesidePlacement,
	type MoveDirection
} from './rankedSet';

/**
 * One scope of a ranked set: how to load its rows in their current order and
 * how to save a new order. Saving is where the dense 1..n ranks are written;
 * the operations below only decide the order.
 */
export type RankedScope<Item extends { id: string }> = {
	load: () => Promise<Item[]>;
	readRank: (item: Item) => number | null;
	save: (itemsInOrder: Item[]) => Promise<void>;
};

/** Put one row at a rank; the rest shift to make room. False when it is not in the scope. */
export async function setRank<Item extends { id: string }>(
	scope: RankedScope<Item>,
	movedId: string,
	rank: number
): Promise<boolean> {
	const items = await loadInOrder(scope);
	const newOrder = withItemAtRank(items, movedId, rank);
	if (newOrder === null) return false;
	await scope.save(newOrder);
	return true;
}

export async function moveByOne<Item extends { id: string }>(
	scope: RankedScope<Item>,
	movedId: string,
	direction: MoveDirection
): Promise<boolean> {
	const items = await loadInOrder(scope);
	const newOrder = withItemMovedByOne(items, movedId, direction);
	if (newOrder === null) return false;
	await scope.save(newOrder);
	return true;
}

export async function placeBeside<Item extends { id: string }>(
	scope: RankedScope<Item>,
	movedId: string,
	targetId: string,
	placement: BesidePlacement
): Promise<boolean> {
	const items = await loadInOrder(scope);
	const newOrder = withItemBeside(items, movedId, targetId, placement);
	if (newOrder === null) return false;
	await scope.save(newOrder);
	return true;
}

async function loadInOrder<Item extends { id: string }>(
	scope: RankedScope<Item>
): Promise<Item[]> {
	return orderByRank(await scope.load(), scope.readRank);
}
