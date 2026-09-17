<script lang="ts">
	import type { Goal } from '$lib/server/goals/goalRecord';

	let {
		goal,
		projectId,
		taskCountLabel
	}: { goal: Goal | null; projectId: string; taskCountLabel: string } = $props();

	const badgeClasses = $derived(
		goal === null ? 'border-hairline text-chalk/50' : 'border-go/40 bg-go/10 text-go'
	);
</script>

<header
	class="flex items-center justify-between gap-4 border-b border-hairline bg-night/50 px-4 py-3"
>
	<div class="flex min-w-0 items-center gap-3">
		<span
			class={`shrink-0 rounded-full border px-2.5 py-0.5 font-display text-xs whitespace-nowrap
				${badgeClasses}`}
		>
			{goal === null ? 'No goal' : 'Goal'}
		</span>
		{#if goal === null}
			<h3 class="truncate font-display font-medium text-chalk/70">Other tasks</h3>
		{:else}
			<a
				href={`/projects/${projectId}/goals/${goal.id}`}
				class="truncate font-display font-medium transition hover:text-go"
			>
				{goal.title}
			</a>
		{/if}
	</div>
	<span class="shrink-0 font-display text-xs whitespace-nowrap text-chalk/50">
		{taskCountLabel}
	</span>
</header>
