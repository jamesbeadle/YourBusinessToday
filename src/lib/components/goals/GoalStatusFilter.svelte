<script lang="ts">
	import { filterChipClasses } from '$lib/components/projects/filterChipClasses';

	let { shouldIncludeClosed = $bindable() }: { shouldIncludeClosed: boolean } = $props();

	const filterOptions = $derived([
		{ label: 'Open', includesClosed: false, isSelected: !shouldIncludeClosed },
		{ label: 'All', includesClosed: true, isSelected: shouldIncludeClosed }
	]);
</script>

<div class="flex flex-wrap items-center gap-2" aria-label="Goal status">
	{#each filterOptions as filterOption (filterOption.label)}
		<button
			type="button"
			onclick={() => (shouldIncludeClosed = filterOption.includesClosed)}
			class={filterChipClasses(filterOption.isSelected)}
		>
			{filterOption.label}
		</button>
	{/each}
</div>
