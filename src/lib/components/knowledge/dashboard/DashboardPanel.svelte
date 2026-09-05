<script lang="ts">
	import DashboardPanelHeader from './DashboardPanelHeader.svelte';
	import DashboardSheet from './DashboardSheet.svelte';
	import { dashboardMotion, panelEasing } from './dashboardMotion';
	import { screen } from '$lib/client/screen.svelte';
	import { fly } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	let {
		title,
		onClose,
		children
	}: { title: string; onClose: () => void; children: Snippet } = $props();

	const columnWidthPixels = 380;
</script>

<svelte:window onkeydown={(event) => event.key === 'Escape' && onClose()} />

{#if screen.isWideScreen}
	<aside
		class="flex shrink-0 flex-col border-l border-hairline bg-night"
		style:width={`${columnWidthPixels}px`}
		transition:fly={{
			x: columnWidthPixels,
			duration: dashboardMotion.panelSlideMilliseconds,
			easing: panelEasing,
			opacity: 1
		}}
	>
		<DashboardPanelHeader {title} {onClose} />
		<div class="flex min-h-0 flex-1 flex-col overflow-hidden">
			{@render children()}
		</div>
	</aside>
{:else}
	<DashboardSheet {title} {onClose}>
		{@render children()}
	</DashboardSheet>
{/if}
