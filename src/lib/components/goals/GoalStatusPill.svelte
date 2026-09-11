<script lang="ts">
	import { goalStatusLabels, type GoalStatus } from '$lib/data/goalStatus';

	let { status }: { status: GoalStatus } = $props();

	const pillStyles: Record<GoalStatus, string> = {
		open: 'border-hairline text-chalk/70',
		met: 'border-go/60 text-go',
		dropped: 'border-hairline text-chalk/40 line-through'
	};
</script>

<span class={`rounded-full border px-3 py-1 font-display text-xs ${pillStyles[status]}`}>
	{goalStatusLabels[status]}
</span>
