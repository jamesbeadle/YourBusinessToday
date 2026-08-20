<script module lang="ts">
	export type EntityTab = 'domains' | 'workflows';
</script>

<script lang="ts">
	let {
		activeTab,
		domainBrainCount,
		workflowCount,
		onSelect
	}: {
		activeTab: EntityTab;
		domainBrainCount: number;
		workflowCount: number;
		onSelect: (tab: EntityTab) => void;
	} = $props();

	const tabs = $derived([
		{ id: 'domains' as EntityTab, label: `Domains · ${domainBrainCount}` },
		{ id: 'workflows' as EntityTab, label: `Workflows · ${workflowCount}` }
	]);
</script>

<div role="tablist" aria-label="Entity features" class="flex gap-2 border-b border-hairline">
	{#each tabs as tab (tab.id)}
		<button
			type="button"
			role="tab"
			aria-selected={activeTab === tab.id}
			onclick={() => onSelect(tab.id)}
			class={`-mb-px border-b-2 px-4 py-2.5 font-display text-sm transition ${
				activeTab === tab.id
					? 'border-signal text-chalk'
					: 'border-transparent text-chalk/60 hover:text-chalk'
			}`}
		>
			{tab.label}
		</button>
	{/each}
</div>
