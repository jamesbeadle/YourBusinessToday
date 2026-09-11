<script lang="ts">
	import CompletionBar from '$lib/components/projects/CompletionBar.svelte';
	import GoalStatusPill from './GoalStatusPill.svelte';
	import type { GoalSummary } from '$lib/server/goals/getGoalSummaries';

	let { goalSummary }: { goalSummary: GoalSummary } = $props();

	const taskCountLabel = $derived(
		goalSummary.taskCount === 1 ? '1 task' : `${goalSummary.taskCount} tasks`
	);
</script>

<li class="flex flex-wrap items-center gap-x-4 gap-y-2">
	<a
		href={`/projects/${goalSummary.projectId}/goals/${goalSummary.id}`}
		class="w-full truncate font-display text-sm transition hover:text-go sm:w-64"
	>
		{goalSummary.title}
	</a>
	<span class="w-16 text-xs whitespace-nowrap text-chalk/50">{taskCountLabel}</span>
	<div class="min-w-40 flex-1">
		<CompletionBar completionPercent={goalSummary.completionPercent} />
	</div>
	{#if goalSummary.awaitingAnswerCount > 0}
		<span class="text-xs whitespace-nowrap text-signal">
			{goalSummary.awaitingAnswerCount} awaiting an answer
		</span>
	{/if}
	<GoalStatusPill status={goalSummary.status} />
</li>
