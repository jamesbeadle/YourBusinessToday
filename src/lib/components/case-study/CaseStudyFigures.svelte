<script lang="ts">
	import type { CaseStudyFigure } from '$lib/data/caseStudies';

	let { figures }: { figures: CaseStudyFigure[] } = $props();
</script>

<dl class="grid grid-cols-2 gap-6 border-t border-hairline pt-6 md:grid-cols-4">
	{#each figures as figure (figure.label)}
		<div class="flex flex-col gap-1">
			<dt class="font-display text-2xl font-medium md:text-3xl">{figure.value}</dt>
			<dd class="font-display text-xs tracking-widest text-chalk/50 uppercase">
				{figure.label}
			</dd>
		</div>
	{/each}
</dl>
