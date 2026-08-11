export type DropPlacement = 'before' | 'after';

export type SubmitListReorder = (
	movedId: string,
	targetId: string,
	placement: DropPlacement
) => Promise<void>;

/**
 * Drag-to-reorder state for one list: which row is being dragged, which row
 * the pointer is over, and whether a drop would land before or after it.
 * Rows carry a sibling-group key (for nested lists), so a drag can only
 * drop among the rows it started beside.
 */
export class ListReorder {
	draggedId = $state<string | null>(null);
	draggedGroupId = $state<string | null>(null);
	dropTargetId = $state<string | null>(null);
	dropPlacement = $state<DropPlacement>('before');
	readonly submitReorder: SubmitListReorder;

	constructor(submitReorder: SubmitListReorder) {
		this.submitReorder = submitReorder;
	}

	beginDrag(rowId: string, groupId: string | null): void {
		this.draggedId = rowId;
		this.draggedGroupId = groupId;
	}

	trackDragOver(rowId: string, groupId: string | null, event: DragEvent): void {
		if (this.draggedId === null || this.draggedId === rowId) return;
		if (groupId !== this.draggedGroupId) return;
		event.preventDefault();
		event.stopPropagation();
		if (event.dataTransfer !== null) event.dataTransfer.dropEffect = 'move';
		this.dropTargetId = rowId;
		this.dropPlacement = readDropPlacement(event);
	}

	async completeDrop(): Promise<void> {
		const { draggedId, dropTargetId, dropPlacement } = this;
		this.reset();
		if (draggedId === null || dropTargetId === null) return;
		await this.submitReorder(draggedId, dropTargetId, dropPlacement);
	}

	reset(): void {
		this.draggedId = null;
		this.draggedGroupId = null;
		this.dropTargetId = null;
	}
}

function readDropPlacement(event: DragEvent): DropPlacement {
	const row = event.currentTarget as HTMLElement;
	const rowBounds = row.getBoundingClientRect();
	const rowMiddle = rowBounds.top + rowBounds.height / 2;
	return event.clientY < rowMiddle ? 'before' : 'after';
}
