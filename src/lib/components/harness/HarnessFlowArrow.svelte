<script lang="ts">
	let { direction, caption }: { direction: 'into' | 'both'; caption: string } = $props();

	const isTwoWay = $derived(direction === 'both');
</script>

<div
	class="flex items-center justify-center gap-2 font-display text-xs tracking-widest text-chalk/50
		uppercase md:flex-col md:px-1"
	aria-label={caption}
>
	<span class="text-2xl text-signal md:hidden" aria-hidden="true">{isTwoWay ? '↕' : '↓'}</span>
	<span class="hidden text-2xl text-signal md:block" aria-hidden="true">
		{isTwoWay ? '⇄' : '→'}
	</span>
	<span class="max-w-24 text-center leading-relaxed">{caption}</span>
</div>
