<script lang="ts">
	import BuildBriefForm from './BuildBriefForm.svelte';
	import BuildStatusPill from './BuildStatusPill.svelte';
	import { builderTierFor, builderTierLabels } from '$lib/data/builderTier';
	import type { Project } from '$lib/server/projects/projectRecord';
	import type { ProjectTask } from '$lib/server/projects/taskRecord';

	let { task, project }: { task: ProjectTask; project: Project } = $props();

	const tierLabel = $derived(builderTierLabels[builderTierFor(task.storyPoints)]);
	const canSend = $derived(task.buildStatus !== 'live' && task.buildStatus !== 'in_review');
	const linkClasses = 'font-display text-sm text-go hover:brightness-110';
</script>

<section class="flex flex-col gap-4 rounded-2xl border border-hairline p-6">
	<div class="flex flex-wrap items-center justify-between gap-3">
		<div class="flex items-center gap-3">
			<h2 class="font-display text-xl font-medium">Build</h2>
			<BuildStatusPill status={task.buildStatus} />
		</div>
		<span class="text-sm text-chalk/60">{task.storyPoints} points · {tierLabel} Builder</span>
	</div>
	{#if task.hasMigration && task.buildStatus === 'in_review'}
		<p class="rounded-2xl border border-caution/40 bg-caution/10 px-5 py-3 text-sm text-caution">
			This build includes a migration. Read the SQL, apply it to the live database, then add the
			<code>migration-reviewed</code> label on the pull request. It merges itself after that.
		</p>
	{/if}
	<div class="flex flex-wrap gap-x-6 gap-y-2">
		{#if task.pullRequestUrl !== ''}
			<a href={task.pullRequestUrl} target="_blank" rel="noreferrer" class={linkClasses}>Pull request →</a>
		{/if}
		{#if task.buildSessionUrl !== ''}
			<a href={task.buildSessionUrl} target="_blank" rel="noreferrer" class={linkClasses}>The run →</a>
		{/if}
		{#if task.buildStatus === 'live' && project.environmentUrl !== ''}
			<a href={project.environmentUrl} target="_blank" rel="noreferrer" class={linkClasses}>Live →</a>
		{/if}
	</div>
	<BuildBriefForm {task} {canSend} />
</section>
