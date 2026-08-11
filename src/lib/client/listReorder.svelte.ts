import { EdgeAutoScroller } from '$lib/client/edgeAutoScroller';
import { findReorderRow } from '$lib/client/findReorderRow';

export type DropPlacement = 'before' | 'after';

export type SubmitListReorder = (
	movedId: string,
	targetId: string,
	placement: DropPlacement
) => Promise<void>;

let nextListNumber = 0;

/**
 * Drag-to-reorder state for one list, driven by pointer events so it works
 * with both mouse and touch. Rows carry a sibling-group key (for nested
 * lists), so a drag can only drop among the rows it started beside.
 */
export class ListReorder {
	draggedId = $state<string | null>(null);
	draggedGroupId = $state<string | null>(null);
	dropTargetId = $state<string | null>(null);
	dropPlacement = $state<DropPlacement>('before');
	readonly listId: string;
	readonly submitReorder: SubmitListReorder;
	#autoScroller = new EdgeAutoScroller();

	constructor(submitReorder: SubmitListReorder) {
		this.submitReorder = submitReorder;
		nextListNumber += 1;
		this.listId = `reorder-${nextListNumber}`;
	}

	beginDrag(rowId: string, groupId: string | null): void {
		this.draggedId = rowId;
		this.draggedGroupId = groupId;
	}

	trackDrag(event: PointerEvent): void {
		if (this.draggedId === null) return;
		this.#autoScroller.follow(event.clientY);
		const dropTarget = findReorderRow(
			this.listId,
			this.draggedGroupId,
			event.clientX,
			event.clientY
		);
		if (dropTarget === null || dropTarget.rowId === this.draggedId) {
			this.dropTargetId = null;
			return;
		}
		this.dropTargetId = dropTarget.rowId;
		this.dropPlacement = dropTarget.placement;
	}

	async completeDrop(): Promise<void> {
		const { draggedId, dropTargetId, dropPlacement } = this;
		this.reset();
		if (draggedId === null || dropTargetId === null) return;
		await this.submitReorder(draggedId, dropTargetId, dropPlacement);
	}

	reset(): void {
		this.#autoScroller.stop();
		this.draggedId = null;
		this.draggedGroupId = null;
		this.dropTargetId = null;
	}
}
