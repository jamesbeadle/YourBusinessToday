<script lang="ts">
	import { clientStageLabels, type ClientStage } from '$lib/data/clientLifecycle';
	import { stageDotClasses } from '$lib/components/clients/stageTones';

	let { stages }: { stages: ClientStage[] } = $props();

	const companyCount = $derived(`${stages.length} compan${stages.length === 1 ? 'y' : 'ies'}`);
</script>

<span class="flex items-center gap-1.5 text-xs text-chalk/50" title={stages.map((stage) => clientStageLabels[stage]).join(', ')}>
	{#each stages as stage, index (index)}
		<span class={`h-2 w-2 rounded-full ${stageDotClasses[stage]}`} aria-hidden="true"></span>
	{/each}
	<span>{companyCount}</span>
</span>
