<script lang="ts">
	import BrandWordmark from './BrandWordmark.svelte';
</script>

<footer class="border-t border-hairline bg-night">
	<div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6">
		<div class="flex items-center gap-3">
			<BrandWordmark fontSize={18} />
			<p class="text-sm text-chalk/60">
				Your Business Today — an ecosystem of AI tools that know your business.
			</p>
		</div>
		<p class="font-display text-xs tracking-widest text-chalk/40 uppercase">Early access</p>
	</div>
</footer>
