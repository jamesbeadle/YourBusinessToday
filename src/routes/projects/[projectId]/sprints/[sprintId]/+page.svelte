<script lang="ts">
	import PhaseProgressBar from '$lib/components/projects/PhaseProgressBar.svelte';
	import SprintTaskRow from '$lib/components/projects/SprintTaskRow.svelte';

	let { data } = $props();

	function phaseName(phaseId: string | null): string | null {
		const phase = data.phases.find((candidate) => candidate.id === phaseId);
		return phase?.name ?? null;
	}
</script>

<svelte:head>
	<title>{data.sprint.name} — {data.project.name} — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16">
	<div class="flex flex-col gap-2">
		<a
			href={`/projects/${data.project.id}/sprints`}
			class="font-display text-sm text-chalk/50 transition hover:text-chalk"
		>
			← All sprints
		</a>
		<h1 class="font-display text-3xl font-medium">{data.sprint.name}</h1>
		<PhaseProgressBar completionPercent={data.completionPercent} />
	</div>
	{#if data.tasks.length === 0}
		<p class="rounded-2xl border border-dashed border-hairline p-8 text-center text-chalk/60">
			No tasks in this sprint yet — assign tasks to it from their detail pages.
		</p>
	{:else}
		<ol class="flex flex-col divide-y divide-hairline rounded-2xl border border-hairline">
			{#each data.tasks as task, taskIndex (task.id)}
				<SprintTaskRow
					{task}
					positionNumber={taskIndex + 1}
					phaseName={phaseName(task.phaseId)}
				/>
			{/each}
		</ol>
	{/if}
</div>
