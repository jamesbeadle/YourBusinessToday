<script lang="ts">
	import BrainTitleBand from './BrainTitleBand.svelte';
	import DashboardToolbar from './DashboardToolbar.svelte';
	import { topRowHeightPixels } from './dashboardLayout';
	import { useDashboardTools } from './dashboardTools.svelte';
	import { newBrainHref } from '$lib/data/knowledge/knowledgeBaseRoutes';
	import type { ConstellationSlot } from '../constellationSlots';

	let {
		knowledgeBaseId,
		openSlot,
		badgeCounts
	}: {
		knowledgeBaseId: string;
		openSlot: ConstellationSlot | null;
		badgeCounts: Record<string, number>;
	} = $props();

	const dashboardTools = useDashboardTools();
</script>

<div
	class="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-3
		px-3"
	style:height={`${topRowHeightPixels}px`}
>
	{#if openSlot === null}
		<a
			href={newBrainHref(knowledgeBaseId)}
			aria-label="Add a second brain"
			title="Add a second brain"
			class="pointer-events-auto min-w-0 shrink rounded-full border border-hairline bg-night/80 px-3
				py-1.5 font-display text-xs whitespace-nowrap text-chalk/60 transition hover:border-signal
				hover:text-signal sm:px-4"
		>
			+<span class="hidden sm:inline"> Add a second brain</span>
		</a>
	{:else}
		<BrainTitleBand {openSlot} />
	{/if}
	<DashboardToolbar
		tools={dashboardTools.tools}
		activeKey={dashboardTools.activeKey}
		{badgeCounts}
		onSelect={(key) => dashboardTools.toggle(key)}
	/>
</div>
