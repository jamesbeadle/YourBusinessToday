import type { DropPlacement } from '$lib/client/listReorder.svelte';

export type ReorderDropTarget = { rowId: string; placement: DropPlacement };

/**
 * Hit-test the pointer against the rows of one reorder list: finds the row
 * under the pointer that belongs to the given list and sibling group,
 * walking outward through nested groups so hovering a subtask still counts
 * for the enclosing top-level row.
 */
export function findReorderRow(
	listId: string,
	groupId: string | null,
	clientX: number,
	clientY: number
): ReorderDropTarget | null {
	const pointedElement = document.elementFromPoint(clientX, clientY);
	let row = pointedElement?.closest('[data-reorder-list]') ?? null;
	while (row instanceof HTMLElement) {
		if (isMatchingRow(row, listId, groupId)) return dropTargetFor(row, clientY);
		row = row.parentElement?.closest('[data-reorder-list]') ?? null;
	}
	return null;
}

function isMatchingRow(row: HTMLElement, listId: string, groupId: string | null): boolean {
	return row.dataset.reorderList === listId && row.dataset.reorderGroup === (groupId ?? '');
}

function dropTargetFor(row: HTMLElement, clientY: number): ReorderDropTarget {
	const rowBounds = row.getBoundingClientRect();
	const isInTopHalf = clientY < rowBounds.top + rowBounds.height / 2;
	return { rowId: row.dataset.reorderRow ?? '', placement: isInTopHalf ? 'before' : 'after' };
}
