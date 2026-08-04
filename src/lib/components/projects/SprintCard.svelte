<script lang="ts">
	import { enhance } from '$app/forms';
	import PhaseProgressBar from './PhaseProgressBar.svelte';
	import type { SprintSummary } from '$lib/server/projects/getSprintSummaries';

	let { sprintSummary }: { sprintSummary: SprintSummary } = $props();

	const dateRange = $derived(formatDateRange(sprintSummary.startsOn, sprintSummary.endsOn));

	function formatDateRange(startsOn: string | null, endsOn: string | null): string {
		if (startsOn === null && endsOn === null) return '';
		return [formatDate(startsOn), formatDate(endsOn)].join(' → ');
	}

	function formatDate(isoDate: string | null): string {
		if (isoDate === null) return '…';
		return new Date(isoDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
	}
</script>

<li
	class="flex flex-col gap-3 rounded-2xl border border-hairline bg-carriage p-6 transition
		hover:border-signal/60"
>
	<a
		href={`/projects/${sprintSummary.projectId}/sprints/${sprintSummary.id}`}
		class="flex flex-col gap-2"
	>
		<p class="font-display text-lg font-medium">{sprintSummary.name}</p>
		{#if dateRange !== ''}
			<p class="text-sm text-chalk/60">{dateRange}</p>
		{/if}
		<p class="text-sm text-chalk/50">
			{sprintSummary.taskCount === 1 ? '1 task' : `${sprintSummary.taskCount} tasks`}
		</p>
		<PhaseProgressBar completionPercent={sprintSummary.completionPercent} />
	</a>
	<form method="POST" action="?/deleteSprint" use:enhance class="self-end">
		<input type="hidden" name="sprintId" value={sprintSummary.id} />
		<button
			type="submit"
			class="rounded-full border border-hairline px-4 py-1.5 font-display text-xs text-chalk/60
				transition hover:border-signal hover:text-signal"
		>
			Delete
		</button>
	</form>
</li>
