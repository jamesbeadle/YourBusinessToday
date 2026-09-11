<script lang="ts">
	let { completionPercent }: { completionPercent: number } = $props();
</script>

<div class="flex items-center gap-3">
	<div class="h-2 flex-1 overflow-hidden rounded-full bg-night">
		<div class="h-full rounded-full bg-go transition-all" style={`width: ${completionPercent}%`}></div>
	</div>
	<span class="w-10 text-right font-display text-xs text-chalk/60">{completionPercent}%</span>
</div>
