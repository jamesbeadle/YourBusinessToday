<script lang="ts">
	import type { ProjectTask } from '$lib/server/projects/taskRecord';

	let { task, raisedByName }: { task: ProjectTask; raisedByName: string } = $props();
</script>

<div class="flex flex-col gap-3">
	<p class="text-sm text-chalk/70">
		Support task raised by <span class="font-display text-chalk/90">{raisedByName}</span>
	</p>
	{#if task.resolution !== ''}
		<div class="rounded-2xl border border-go/40 bg-go/10 px-5 py-3">
			<span class="font-display text-xs tracking-widest text-go uppercase">Resolution</span>
			<p class="mt-1 whitespace-pre-wrap text-sm text-chalk/90">{task.resolution}</p>
		</div>
	{/if}
</div>
