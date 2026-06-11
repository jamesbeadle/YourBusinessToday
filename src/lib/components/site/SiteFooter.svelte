<script lang="ts">
	import Roundel from './Roundel.svelte';
</script>

<footer class="border-t-4 border-tfl-blue bg-map-paper">
	<div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6">
		<div class="flex items-center gap-3">
			<Roundel size={32} />
			<p class="text-sm text-map-ink/70">
				Your Business Today — map your business like the Underground.
			</p>
		</div>
		<p class="font-display text-xs tracking-widest text-map-ink/50 uppercase">Demo preview</p>
	</div>
</footer>
