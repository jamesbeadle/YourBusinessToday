<script lang="ts">
	let {
		projectName,
		onEdit,
		onDelete
	}: { projectName: string; onEdit: () => void; onDelete: () => void } = $props();

	let isOpen = $state(false);
	let menuElement: HTMLElement | undefined = $state();

	function closeOnOutsideClick(event: MouseEvent) {
		if (!isOpen) return;
		if (menuElement?.contains(event.target as Node)) return;
		isOpen = false;
	}

	function choose(menuAction: () => void) {
		isOpen = false;
		menuAction();
	}
</script>

<svelte:window onclick={closeOnOutsideClick} />

<div class="relative" bind:this={menuElement}>
	<button
		type="button"
		onclick={() => (isOpen = !isOpen)}
		aria-haspopup="menu"
		aria-expanded={isOpen}
		aria-label={`Actions for ${projectName}`}
		class="rounded-full border border-hairline px-4 py-1.5 font-display text-sm text-chalk/70
			transition hover:border-go hover:text-go"
	>
		Actions <span aria-hidden="true" class="ml-1 text-xs">▾</span>
	</button>
	{#if isOpen}
		<div
			role="menu"
			class="absolute top-full right-0 z-10 mt-2 flex w-44 flex-col rounded-2xl border
				border-hairline bg-night p-2 shadow-xl"
		>
			<button
				type="button"
				onclick={() => choose(onEdit)}
				class="w-full rounded-xl px-3 py-2 text-left font-display text-sm text-chalk/80
					transition hover:bg-hairline/40 hover:text-chalk"
			>
				Edit…
			</button>
			<button
				type="button"
				onclick={() => choose(onDelete)}
				class="w-full rounded-xl px-3 py-2 text-left font-display text-sm text-signal/90
					transition hover:bg-signal/10 hover:text-signal"
			>
				Delete…
			</button>
		</div>
	{/if}
</div>
