<script lang="ts">
	import Roundel from '../site/Roundel.svelte';
</script>

<div class="flex items-center gap-3">
	<Roundel size={30} />
	<div
		class="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-map-grid bg-map-paper
			px-4 py-3.5 shadow-sm"
	>
		<span class="h-2 w-2 animate-bounce rounded-full bg-map-ink/40"></span>
		<span class="h-2 w-2 animate-bounce rounded-full bg-map-ink/40 [animation-delay:150ms]"></span>
		<span class="h-2 w-2 animate-bounce rounded-full bg-map-ink/40 [animation-delay:300ms]"></span>
	</div>
</div>
