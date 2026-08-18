<script lang="ts">
	import AddChecklistItemForm from './AddChecklistItemForm.svelte';
	import ChecklistItemRow from './ChecklistItemRow.svelte';
	import DangerConfirmModal from '$lib/components/site/DangerConfirmModal.svelte';
	import RenameChecklistModal from './RenameChecklistModal.svelte';
	import type { TaskChecklist } from '$lib/server/projects/checklistRecord';

	let { checklist }: { checklist: TaskChecklist } = $props();

	let isRenameModalOpen = $state(false);
	let isDeleteModalOpen = $state(false);

	const doneCount = $derived(checklist.items.filter((item) => item.isDone).length);
</script>

<div class="rounded-2xl border border-hairline">
	<div class="flex items-center justify-between gap-4 px-5 py-3">
		<div class="flex items-baseline gap-3">
			<h3 class="font-display text-base font-medium">{checklist.title}</h3>
			{#if checklist.items.length > 0}
				<span class="font-display text-sm text-chalk/50">
					{doneCount} of {checklist.items.length} done
				</span>
			{/if}
		</div>
		<div class="flex items-center gap-2">
			<button
				type="button"
				onclick={() => (isRenameModalOpen = true)}
				class="rounded-full border border-hairline px-3 py-1 font-display text-xs text-chalk/60
					transition hover:border-chalk/40 hover:text-chalk"
			>
				Rename
			</button>
			<button
				type="button"
				onclick={() => (isDeleteModalOpen = true)}
				aria-label={`Delete “${checklist.title}”`}
				class="px-1 text-chalk/40 transition hover:text-signal"
			>
				✕
			</button>
		</div>
	</div>
	{#if checklist.items.length > 0}
		<ul class="flex flex-col divide-y divide-hairline border-t border-hairline">
			{#each checklist.items as item (item.id)}
				<ChecklistItemRow {item} />
			{/each}
		</ul>
	{/if}
	<AddChecklistItemForm checklistId={checklist.id} />
</div>

<RenameChecklistModal {checklist} bind:isOpen={isRenameModalOpen} />

<DangerConfirmModal
	title="Delete list"
	description={`This permanently deletes “${checklist.title}” and everything on it. This cannot be undone.`}
	action="?/deleteChecklist"
	fields={{ checklistId: checklist.id }}
	submitLabel="Delete list"
	bind:isOpen={isDeleteModalOpen}
/>
