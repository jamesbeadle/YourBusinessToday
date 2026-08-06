<script lang="ts">
	import { projectStatusLabels, projectStatusOrder, type ProjectStatus } from '$lib/data/projectStatus';

	let {
		searchText = $bindable(),
		selectedStatus = $bindable()
	}: { searchText: string; selectedStatus: ProjectStatus | 'all' } = $props();

	const statusFilters: (ProjectStatus | 'all')[] = ['all', ...projectStatusOrder];

	function filterLabel(statusFilter: ProjectStatus | 'all'): string {
		if (statusFilter === 'all') return 'All';
		return projectStatusLabels[statusFilter];
	}
</script>

<div class="flex flex-wrap items-center justify-between gap-4">
	<div class="flex flex-wrap items-center gap-2">
		{#each statusFilters as statusFilter (statusFilter)}
			<button
				type="button"
				onclick={() => (selectedStatus = statusFilter)}
				class={`rounded-full border px-4 py-1.5 font-display text-sm transition ${
					selectedStatus === statusFilter
						? 'border-go bg-go/10 text-go'
						: 'border-hairline text-chalk/60 hover:border-chalk/40 hover:text-chalk'
				}`}
			>
				{filterLabel(statusFilter)}
			</button>
		{/each}
	</div>
	<input
		bind:value={searchText}
		type="search"
		placeholder="Search projects"
		aria-label="Search projects by name"
		class="w-64 rounded-full border border-hairline bg-carriage px-5 py-2 text-sm text-chalk
			outline-none focus:border-go"
	/>
</div>
