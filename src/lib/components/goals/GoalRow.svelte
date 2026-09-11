<script lang="ts">
	import GoalStatusPill from './GoalStatusPill.svelte';
	import type { GoalSummary } from '$lib/server/goals/getGoalSummaries';

	let { goalSummary }: { goalSummary: GoalSummary } = $props();

	const progress = $derived(
		goalSummary.taskCount === 0
			? 'no tasks yet'
			: `${goalSummary.doneTaskCount} of ${goalSummary.taskCount} tasks done`
	);
</script>

<li class="flex flex-wrap items-center gap-x-4 gap-y-1">
	<a
		href={`/projects/${goalSummary.projectId}/goals/${goalSummary.id}`}
		class="min-w-0 flex-1 basis-48 truncate font-display text-sm transition hover:text-go"
	>
		{goalSummary.title}
	</a>
	<span class="text-xs whitespace-nowrap text-chalk/50">{progress}</span>
	{#if goalSummary.awaitingAnswerCount > 0}
		<span class="text-xs whitespace-nowrap text-signal">
			{goalSummary.awaitingAnswerCount} awaiting an answer
		</span>
	{/if}
	<GoalStatusPill status={goalSummary.status} />
</li>
