<script lang="ts">
	import DashboardToolbar from './DashboardToolbar.svelte';
	import { useDashboardTools } from './dashboardTools.svelte';
	import { newBrainHref } from '$lib/data/knowledge/knowledgeBaseRoutes';

	let {
		knowledgeBaseId,
		isBrainOpen,
		badgeCounts
	}: {
		knowledgeBaseId: string;
		isBrainOpen: boolean;
		badgeCounts: Record<string, number>;
	} = $props();

	const dashboardTools = useDashboardTools();
</script>

<div
	class="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3
		p-3"
>
	<a
		href={newBrainHref(knowledgeBaseId)}
		aria-label="Add a second brain"
		title="Add a second brain"
		class={[
			'pointer-events-auto rounded-full border border-hairline bg-night/80 px-3 py-1.5 sm:px-4',
			'font-display text-xs text-chalk/60 transition hover:border-signal hover:text-signal',
			isBrainOpen && 'invisible'
		]}
	>
		+<span class="hidden sm:inline"> Add a second brain</span>
	</a>
	<DashboardToolbar
		tools={dashboardTools.tools}
		activeKey={dashboardTools.activeKey}
		{badgeCounts}
		onSelect={(key) => dashboardTools.toggle(key)}
	/>
</div>
