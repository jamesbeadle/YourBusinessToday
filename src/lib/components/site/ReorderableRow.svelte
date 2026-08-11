<script lang="ts">
	import type { ListReorder } from '$lib/client/listReorder.svelte';
	import type { Snippet } from 'svelte';

	let {
		listReorder,
		rowId,
		groupId = null,
		tag = 'li',
		class: rowClasses = '',
		children
	}: {
		listReorder: ListReorder;
		rowId: string;
		groupId?: string | null;
		tag?: 'li' | 'tr';
		class?: string;
		children: Snippet<[Snippet]>;
	} = $props();

	let isDraggable = $state(false);

	const isDragged = $derived(listReorder.draggedId === rowId);
	const isDropTarget = $derived(listReorder.dropTargetId === rowId);
	const dropIndicatorClass = $derived.by(() => {
		if (!isDropTarget) return '';
		if (listReorder.dropPlacement === 'before') return 'shadow-[inset_0_2px_0_0_var(--color-go)]';
		return 'shadow-[inset_0_-2px_0_0_var(--color-go)]';
	});

	function beginRowDrag(event: DragEvent) {
		event.stopPropagation();
		event.dataTransfer?.setData('text/plain', rowId);
		listReorder.beginDrag(rowId, groupId);
	}

	function endRowDrag(event: DragEvent) {
		event.stopPropagation();
		isDraggable = false;
		listReorder.reset();
	}

	function dropOnRow(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		listReorder.completeDrop();
	}
</script>

{#snippet dragHandle()}
	<button
		type="button"
		tabindex="-1"
		aria-hidden="true"
		title="Drag to reorder"
		onmousedown={() => (isDraggable = true)}
		onmouseup={() => (isDraggable = false)}
		class="cursor-grab px-1 text-chalk/30 transition select-none hover:text-chalk/70
			active:cursor-grabbing"
	>
		⠿
	</button>
{/snippet}

<svelte:element
	this={tag}
	role={tag === 'tr' ? 'row' : 'listitem'}
	draggable={isDraggable}
	ondragstart={beginRowDrag}
	ondragend={endRowDrag}
	ondragover={(event: DragEvent) => listReorder.trackDragOver(rowId, groupId, event)}
	ondrop={dropOnRow}
	class={`${rowClasses} ${dropIndicatorClass}`}
	class:opacity-40={isDragged}
>
	{@render children(dragHandle)}
</svelte:element>
