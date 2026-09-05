<script lang="ts">
	import DashboardPanelHeader from './DashboardPanelHeader.svelte';
	import { dashboardMotion, panelEasing } from './dashboardMotion';
	import { screen } from '$lib/client/screen.svelte';
	import { fade, fly } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	let {
		title,
		onClose,
		children
	}: { title: string; onClose: () => void; children: Snippet } = $props();

	const columnWidthPixels = 380;
	const sheetHeight = '85dvh';
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
	<button
		type="button"
		aria-label="Close panel"
		class="fixed inset-0 z-40 bg-night/70"
		transition:fade={{ duration: dashboardMotion.scrimFadeMilliseconds }}
		onclick={onClose}
	></button>
	<section
		aria-label={title}
		class="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-3xl border-t border-hairline
			bg-night"
		style:height={sheetHeight}
		transition:fly={{
			y: '100%',
			duration: dashboardMotion.panelSlideMilliseconds,
			easing: panelEasing,
			opacity: 1
		}}
	>
		<div class="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-hairline"></div>
		<DashboardPanelHeader {title} {onClose} />
		<div class="flex min-h-0 flex-1 flex-col overflow-hidden">
			{@render children()}
		</div>
	</section>
{/if}
