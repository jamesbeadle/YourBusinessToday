<script lang="ts">
	import BrandWordmark from './BrandWordmark.svelte';
</script>

<footer class="border-t border-hairline bg-night print:hidden">
	<div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
		<div class="flex items-center gap-3">
			<BrandWordmark fontSize={18} />
			<p class="text-sm text-chalk/60">
				Your Business Today — a brain for your business.
			</p>
		</div>
		<div class="flex flex-wrap items-center gap-6">
			<a href="/terms" class="text-sm text-chalk/60 transition hover:text-chalk">
				Terms of service
			</a>
			<a href="/privacy" class="text-sm text-chalk/60 transition hover:text-chalk">
				Privacy statement
			</a>
		</div>
	</div>
</footer>
