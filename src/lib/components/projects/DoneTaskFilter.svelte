<script lang="ts">
	import { filterChipClasses } from './filterChipClasses';

	let { shouldIncludeDone = $bindable() }: { shouldIncludeDone: boolean } = $props();

	const filterOptions = $derived([
		{ label: 'Open', includesDone: false, isSelected: !shouldIncludeDone },
		{ label: 'All', includesDone: true, isSelected: shouldIncludeDone }
	]);
</script>

<div class="flex flex-wrap items-center gap-2">
	{#each filterOptions as filterOption (filterOption.label)}
		<button
			type="button"
			onclick={() => (shouldIncludeDone = filterOption.includesDone)}
			class={filterChipClasses(filterOption.isSelected)}
		>
			{filterOption.label}
		</button>
	{/each}
</div>
