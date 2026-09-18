<script lang="ts">
	import SupportTaskFacts from '$lib/components/support/SupportTaskFacts.svelte';
	import TaskFactsRow from './TaskFactsRow.svelte';
	import type { ProjectTask } from '$lib/server/projects/taskRecord';

	let {
		task,
		goalTitle,
		assigneeNames,
		raisedByName,
		onEdit,
		onMoveToProject
	}: {
		task: ProjectTask;
		goalTitle: string | null;
		assigneeNames: string[];
		raisedByName: string;
		onEdit: () => void;
		onMoveToProject: () => void;
	} = $props();

	const storySentence = $derived(
		task.isUserStory && task.storyRole !== ''
			? `As a ${task.storyRole}, I want ${task.storyWant}, so that ${task.storyBenefit}.`
			: null
	);
</script>

<section class="flex flex-col gap-5 rounded-2xl border border-hairline bg-carriage p-6">
	<div class="flex flex-wrap items-center justify-between gap-4">
		<TaskFactsRow {task} {goalTitle} {assigneeNames} />
		<div class="flex flex-wrap items-center gap-3">
			<button
				type="button"
				onclick={onMoveToProject}
				class="rounded-full border border-hairline px-5 py-2 font-display text-sm text-chalk/70
					transition hover:border-go hover:text-go"
			>
				Move to project…
			</button>
			<button
				type="button"
				onclick={onEdit}
				class="rounded-full bg-go px-6 py-2 font-display text-sm font-medium text-night transition
					hover:brightness-110"
			>
				Edit task
			</button>
		</div>
	</div>
	{#if task.kind === 'support'}
		<SupportTaskFacts {task} {raisedByName} />
	{/if}
	{#if storySentence !== null}
		<p class="rounded-2xl border border-caution/40 bg-caution/10 px-5 py-3 text-sm text-caution">
			{storySentence}
		</p>
	{/if}
	{#if task.details !== ''}
		<p class="whitespace-pre-wrap text-sm text-chalk/80">{task.details}</p>
	{/if}
</section>
