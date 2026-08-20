<script lang="ts">
	import DangerConfirmModal from '$lib/components/site/DangerConfirmModal.svelte';
	import Modal from '$lib/components/site/Modal.svelte';
	import RenameEntityForm from './RenameEntityForm.svelte';

	let { entityName }: { entityName: string } = $props();

	let isMenuOpen = $state(false);
	let isRenameModalOpen = $state(false);
	let isDeleteModalOpen = $state(false);

	function openRenameModal() {
		isMenuOpen = false;
		isRenameModalOpen = true;
	}

	function openDeleteModal() {
		isMenuOpen = false;
		isDeleteModalOpen = true;
	}
</script>

<div class="relative">
	<button
		type="button"
		aria-label="Entity actions"
		aria-expanded={isMenuOpen}
		onclick={() => (isMenuOpen = !isMenuOpen)}
		class="rounded-full border border-hairline px-4 py-2 font-display text-sm text-chalk/70
			transition hover:border-chalk/40 hover:text-chalk"
	>
		⋯
	</button>
	{#if isMenuOpen}
		<button
			type="button"
			aria-label="Close menu"
			class="fixed inset-0 z-40 cursor-default"
			onclick={() => (isMenuOpen = false)}
		></button>
		<div
			class="absolute right-0 z-50 mt-2 w-44 rounded-2xl border border-hairline bg-carriage p-2
				shadow-2xl"
		>
			<button
				type="button"
				onclick={openRenameModal}
				class="block w-full rounded-lg px-3 py-2 text-left font-display text-sm text-chalk/80
					transition hover:bg-night/60 hover:text-chalk"
			>
				Rename
			</button>
			<button
				type="button"
				onclick={openDeleteModal}
				class="block w-full rounded-lg px-3 py-2 text-left font-display text-sm text-signal
					transition hover:bg-night/60"
			>
				Delete
			</button>
		</div>
	{/if}
</div>

<Modal title="Rename entity" bind:isOpen={isRenameModalOpen}>
	<RenameEntityForm {entityName} onRenamed={() => (isRenameModalOpen = false)} />
</Modal>

<DangerConfirmModal
	title="Delete this entity?"
	description={`Everything inside ${entityName} — every domain brain and every workflow map —
		is deleted with it. This cannot be undone.`}
	action="?/deleteEntity"
	fields={{}}
	submitLabel="Delete entity"
	confirmWord="DELETE"
	bind:isOpen={isDeleteModalOpen}
/>
