<script lang="ts">
	import { asCssColour, kindColours } from './constellation/constellationPalette';
	import { domainBlockLabels, domainBlockOrder } from '$lib/data/domainBlocks';

	const legendKinds = domainBlockOrder.filter((kind) => kind !== 'context_map');
</script>

<ul
	class="pointer-events-auto hidden flex-col gap-1 rounded-xl border border-hairline bg-night/70 p-3
		backdrop-blur sm:flex"
>
	{#each legendKinds as kind (kind)}
		<li class="flex items-center gap-2 text-xs text-chalk/70">
			<span
				class="h-2 w-2 rounded-full"
				style={`background-color: ${asCssColour(kindColours[kind])}`}
			></span>
			{domainBlockLabels[kind].singular}
		</li>
	{/each}
</ul>
