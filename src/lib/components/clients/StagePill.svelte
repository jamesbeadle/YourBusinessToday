<script lang="ts">
	import { clientStageLabels, type ClientStage } from '$lib/data/clientLifecycle';
	import { stageToneClasses } from './stageTones';

	let { stage }: { stage: ClientStage } = $props();
</script>

<span class={`rounded-full border px-3 py-0.5 text-xs whitespace-nowrap ${stageToneClasses[stage]}`}>
	{clientStageLabels[stage]}
</span>
