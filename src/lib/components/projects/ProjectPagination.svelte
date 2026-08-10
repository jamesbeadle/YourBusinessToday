<script lang="ts">
	let {
		pageNumber = $bindable(),
		pageCount
	}: {
		pageNumber: number;
		pageCount: number;
	} = $props();

	const hasPreviousPage = $derived(pageNumber > 1);
	const hasNextPage = $derived(pageNumber < pageCount);
</script>

{#if pageCount > 1}
	<nav aria-label="Project pages" class="flex items-center justify-between gap-4">
		{#if hasPreviousPage}
			<button
				type="button"
				onclick={() => (pageNumber -= 1)}
				class="rounded-full border border-hairline px-4 py-1.5 font-display text-sm text-chalk/70
					transition hover:border-go hover:text-go"
			>
				← Previous
			</button>
		{:else}
			<span></span>
		{/if}
		<span class="font-display text-sm text-chalk/50">Page {pageNumber} of {pageCount}</span>
		{#if hasNextPage}
			<button
				type="button"
				onclick={() => (pageNumber += 1)}
				class="rounded-full border border-hairline px-4 py-1.5 font-display text-sm text-chalk/70
					transition hover:border-go hover:text-go"
			>
				Next →
			</button>
		{:else}
			<span></span>
		{/if}
	</nav>
{/if}
