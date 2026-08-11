export type DropPlacement = 'before' | 'after' | 'inside';

export type PriorityUpdate = { id: string; value: number };

export function parseDropPlacement(value: unknown): DropPlacement {
	if (value === 'after' || value === 'inside') return value;
	return 'before';
}

export function reorderByDrop<Item extends { id: string }>(
	items: Item[],
	movedId: string,
	targetId: string,
	placement: DropPlacement
): Item[] | null {
	if (movedId === targetId) return null;
	const movedItem = items.find((item) => item.id === movedId);
	if (movedItem === undefined) return null;
	const remainingItems = items.filter((item) => item.id !== movedId);
	const targetIndex = remainingItems.findIndex((item) => item.id === targetId);
	if (targetIndex === -1) return null;
	const insertionIndex = placement === 'before' ? targetIndex : targetIndex + 1;
	return [
		...remainingItems.slice(0, insertionIndex),
		movedItem,
		...remainingItems.slice(insertionIndex)
	];
}

export function reassignValuesInOrder<Item extends { id: string }>(
	itemsInNewOrder: Item[],
	readValue: (item: Item) => number | null
): PriorityUpdate[] {
	const orderedValues = itemsInNewOrder
		.map(readValue)
		.filter((value): value is number => value !== null)
		.sort((firstValue, secondValue) => firstValue - secondValue);
	const updates: PriorityUpdate[] = [];
	let nextValueIndex = 0;
	for (const item of itemsInNewOrder) {
		const currentValue = readValue(item);
		if (currentValue === null) continue;
		const reassignedValue = orderedValues[nextValueIndex];
		nextValueIndex += 1;
		if (reassignedValue !== currentValue) updates.push({ id: item.id, value: reassignedValue });
	}
	return updates;
}
