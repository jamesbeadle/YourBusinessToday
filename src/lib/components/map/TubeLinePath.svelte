<script lang="ts">
	import type { RoleLine } from '$lib/data/types';

	let { line }: { line: RoleLine } = $props();

	const routePoints = $derived(
		line.route.map((point) => `${point.x},${point.y}`).join(' ')
	);
</script>

<polyline
	points={routePoints}
	fill="none"
	stroke={line.colour}
	stroke-width="10"
	stroke-linecap="round"
	stroke-linejoin="round"
/>
