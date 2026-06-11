<script lang="ts">
	import { workflowLines } from '$lib/data/workflowMap';
</script>

<ul class="flex flex-wrap gap-x-8 gap-y-2">
	{#each workflowLines as line (line.id)}
		<li class="flex items-center gap-2">
			<span class="h-2.5 w-9 rounded-full" style={`background-color: ${line.colour}`}></span>
			<span class="font-display text-sm tracking-wide">{line.role}</span>
		</li>
	{/each}
</ul>
