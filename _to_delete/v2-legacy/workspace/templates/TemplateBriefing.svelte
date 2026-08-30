<script lang="ts">
	import type { BrainTemplate } from '$lib/data/brainTemplates';

	let { template }: { template: BrainTemplate } = $props();
</script>

{#if template.feedIdeas.length > 0}
	<div class="flex flex-col gap-2">
		<h3 class="font-display text-xs tracking-widest text-chalk/50 uppercase">Feed it</h3>
		<ul class="flex flex-wrap gap-2">
			{#each template.feedIdeas as feedIdea (feedIdea)}
				<li
					class="rounded-full border border-hairline px-3 py-1 text-xs text-chalk/70"
					style="background: color-mix(in srgb, var(--accent) 8%, transparent)"
				>
					{feedIdea}
				</li>
			{/each}
		</ul>
	</div>
{/if}
{#if template.exampleQuestions.length > 0}
	<div class="flex flex-col gap-2">
		<h3 class="font-display text-xs tracking-widest text-chalk/50 uppercase">Then ask it</h3>
		<ul class="flex flex-col gap-1.5">
			{#each template.exampleQuestions as exampleQuestion (exampleQuestion)}
				<li
					class="border-l-2 pl-3 text-sm text-chalk/70 italic"
					style="border-color: color-mix(in srgb, var(--accent) 60%, transparent)"
				>
					“{exampleQuestion}”
				</li>
			{/each}
		</ul>
	</div>
{/if}
