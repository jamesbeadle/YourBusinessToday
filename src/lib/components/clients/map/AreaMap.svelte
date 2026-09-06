<script lang="ts">
	import { onMount } from 'svelte';
	import { createAreaMap, type AreaMapHandle } from './createAreaMap';
	import type { AreaPin } from '$lib/server/clients/area/areaPin';
	import type { Coordinates } from '$lib/data/distance';

	let {
		centre,
		radiusMiles,
		pins,
		selectedKey,
		onSelect
	}: {
		centre: Coordinates;
		radiusMiles: number;
		pins: AreaPin[];
		selectedKey: string | null;
		onSelect: (key: string) => void;
	} = $props();

	let container: HTMLDivElement;
	let handle = $state<AreaMapHandle | null>(null);

	onMount(() => {
		let isUnmounted = false;
		createAreaMap(container, centre, radiusMiles).then((created) => {
			if (isUnmounted) return created.destroy();
			handle = created;
		});
		return () => {
			isUnmounted = true;
			handle?.destroy();
		};
	});

	$effect(() => {
		handle?.showPins(pins, selectedKey, onSelect);
	});
</script>

<div
	bind:this={container}
	class="h-[28rem] w-full overflow-hidden rounded-2xl border border-hairline bg-carriage lg:h-[36rem]"
	aria-label="Map of the area"
></div>
