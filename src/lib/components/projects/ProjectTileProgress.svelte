<script lang="ts">
	import CompletionBar from './CompletionBar.svelte';

	let {
		openTaskCount,
		taskCount,
		completionPercent
	}: { openTaskCount: number; taskCount: number; completionPercent: number } = $props();

	const taskCountLine = $derived(describeTaskCount());

	function describeTaskCount(): string {
		if (taskCount === 0) return 'No tasks yet';
		if (openTaskCount === 0) return `All ${taskCount} done`;
		return `${openTaskCount} open of ${taskCount}`;
	}
</script>

<div class="mt-auto flex flex-col gap-2">
	<span class="font-display text-xs text-chalk/50">{taskCountLine}</span>
	{#if taskCount > 0}
		<CompletionBar {completionPercent} />
	{/if}
</div>
