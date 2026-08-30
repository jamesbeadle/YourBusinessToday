<script lang="ts">
	import BrainGlyph from './BrainGlyph.svelte';
	import type { ConstellationSlot } from './constellationSlots';

	let { slot, x, y }: { slot: ConstellationSlot; x: number; y: number } = $props();
</script>

<a
	href={slot.href}
	class="group absolute flex w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5
		text-center"
	style={`left: ${x}%; top: ${y}%`}
>
	{#if slot.variant === 'ghost'}
		<span
			class="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed
				font-display text-2xl transition group-hover:scale-105"
			style={`border-color: ${slot.accent}55; color: ${slot.accent}aa`}
		>
			+
		</span>
	{:else}
		<span
			class="rounded-full border-2 p-1 transition group-hover:scale-105"
			style={`border-color: ${slot.accent}66; background-color: ${slot.accent}11`}
		>
			{#if slot.category === null}
				<svg viewBox="0 0 40 40" width="56" height="56" aria-hidden="true">
					<polyline
						points="6,14 22,14 32,24"
						fill="none"
						stroke={slot.accent}
						stroke-width="3"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<polyline
						points="8,30 18,30 26,20 34,20"
						fill="none"
						stroke="var(--color-go)"
						stroke-width="3"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			{:else}
				<BrainGlyph seed={slot.id} category={slot.category} size={56} />
			{/if}
		</span>
	{/if}
	<span class="line-clamp-2 font-display text-xs text-chalk/80 transition group-hover:text-chalk">
		{slot.name}
	</span>
	<span class="font-display text-[10px] tracking-wider uppercase" style={`color: ${slot.accent}`}>
		{slot.kindLabel}
	</span>
</a>
