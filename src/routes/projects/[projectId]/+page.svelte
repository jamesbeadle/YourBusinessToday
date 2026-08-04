<script lang="ts">
	import NewTaskForm from '$lib/components/projects/NewTaskForm.svelte';
	import PhaseListPanel from '$lib/components/projects/PhaseListPanel.svelte';
	import TaskListRow from '$lib/components/projects/TaskListRow.svelte';

	let { data, form } = $props();

	function assigneeNames(taskId: string): string[] {
		const assigneeIds = data.assigneeIdsByTask[taskId] ?? [];
		return data.staffMembers
			.filter((staffMember) => assigneeIds.includes(staffMember.id))
			.map((staffMember) => staffMember.name);
	}

	function phaseName(phaseId: string | null): string | null {
		const phase = data.phaseSummaries.find((phaseSummary) => phaseSummary.id === phaseId);
		return phase?.name ?? null;
	}
</script>

<svelte:head>
	<title>{data.project.name} — Projects — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16">
	<div class="flex flex-col gap-2">
		<a href="/projects" class="font-display text-sm text-chalk/50 transition hover:text-chalk">
			← All projects
		</a>
		<div class="flex items-baseline justify-between gap-4">
			<h1 class="font-display text-3xl font-medium">{data.project.name}</h1>
			<a
				href={`/projects/${data.project.id}/sprints`}
				class="font-display text-sm text-chalk/60 transition hover:text-go"
			>
				Sprints →
			</a>
		</div>
		{#if data.project.description !== ''}
			<p class="text-chalk/70">{data.project.description}</p>
		{/if}
	</div>
	{#if form?.message}
		<p class="rounded-2xl border border-go/50 bg-go/10 px-5 py-4 text-go">
			{form.message}
		</p>
	{/if}
	<PhaseListPanel phaseSummaries={data.phaseSummaries} />
	<NewTaskForm />
	{#if data.tasks.length === 0}
		<p class="rounded-2xl border border-dashed border-hairline p-8 text-center text-chalk/60">
			No tasks yet — add the first one above. The list stays ordered by priority.
		</p>
	{:else}
		<ol class="flex flex-col divide-y divide-hairline rounded-2xl border border-hairline">
			{#each data.tasks as task, taskIndex (task.id)}
				<TaskListRow
					{task}
					positionNumber={taskIndex + 1}
					isFirst={taskIndex === 0}
					isLast={taskIndex === data.tasks.length - 1}
					assigneeNames={assigneeNames(task.id)}
					phaseName={phaseName(task.phaseId)}
				/>
			{/each}
		</ol>
	{/if}
</div>
