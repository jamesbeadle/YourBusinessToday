<script lang="ts">
	import type { RoleLine, Station } from '$lib/data/types';

	let {
		line,
		station,
		isSelected,
		onSelect
	}: { line: RoleLine; station: Station; isSelected: boolean; onSelect: () => void } = $props();

	const x = $derived(station.position.x);
	const y = $derived(station.position.y);

	function selectOnEnter(event: KeyboardEvent) {
		if (event.key !== 'Enter') return;
		onSelect();
	}
</script>

<g
	role="button"
	tabindex="0"
	aria-label={`${station.name} station on the ${line.role} line`}
	class="cursor-pointer outline-none"
	onclick={onSelect}
	onkeydown={selectOnEnter}
>
	{#if station.isInterchange}
		<circle
			cx={x}
			cy={y}
			r="10"
			fill="var(--color-map-paper)"
			stroke="var(--color-map-ink)"
			stroke-width="4"
		/>
	{:else}
		<rect
			x={x - 2.5}
			y={y + 4}
			width="5"
			height="13"
			fill={line.colour}
			transform={`rotate(${station.tickAngle} ${x} ${y})`}
		/>
	{/if}
	{#if isSelected}
		<circle
			cx={x}
			cy={y}
			r="17"
			fill="none"
			stroke={line.colour}
			stroke-width="2.5"
			stroke-dasharray="5 4"
		/>
	{/if}
	<text
		x={x + station.labelOffset.x}
		y={y + station.labelOffset.y}
		text-anchor={station.labelAnchor}
		font-size="12"
		fill="var(--color-map-ink)"
		class="font-display select-none"
	>
		{station.name}
	</text>
</g>
