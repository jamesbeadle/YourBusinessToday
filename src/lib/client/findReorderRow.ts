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
	clientY: number,
	canNestRows: boolean
): ReorderDropTarget | null {
	const pointedElement = document.elementFromPoint(clientX, clientY);
	let row = pointedElement?.closest('[data-reorder-list]') ?? null;
	while (row instanceof HTMLElement) {
		if (isMatchingRow(row, listId, groupId)) return dropTargetFor(row, clientY, canNestRows);
		row = row.parentElement?.closest('[data-reorder-list]') ?? null;
	}
	return null;
}

function isMatchingRow(row: HTMLElement, listId: string, groupId: string | null): boolean {
	return row.dataset.reorderList === listId && row.dataset.reorderGroup === (groupId ?? '');
}

function dropTargetFor(
	row: HTMLElement,
	clientY: number,
	canNestRows: boolean
): ReorderDropTarget {
	const rowId = row.dataset.reorderRow ?? '';
	const rowBounds = row.getBoundingClientRect();
	if (!canNestRows) return { rowId, placement: placementByHalves(rowBounds, clientY) };
	return { rowId, placement: placementByThirds(rowBounds, clientY) };
}

function placementByHalves(rowBounds: DOMRect, clientY: number): DropPlacement {
	const isInTopHalf = clientY < rowBounds.top + rowBounds.height / 2;
	return isInTopHalf ? 'before' : 'after';
}

function placementByThirds(rowBounds: DOMRect, clientY: number): DropPlacement {
	const edgeBandHeight = rowBounds.height / 3;
	if (clientY < rowBounds.top + edgeBandHeight) return 'before';
	if (clientY > rowBounds.bottom - edgeBandHeight) return 'after';
	return 'inside';
}
