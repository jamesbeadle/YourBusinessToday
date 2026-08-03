<script lang="ts">
	import NewTaskForm from '$lib/components/projects/NewTaskForm.svelte';
	import TaskListRow from '$lib/components/projects/TaskListRow.svelte';

	let { data, form } = $props();

	function assigneeName(assigneeId: string | null): string | null {
		const assignee = data.staffMembers.find((staffMember) => staffMember.id === assigneeId);
		return assignee?.name ?? null;
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
		<h1 class="font-display text-3xl font-medium">{data.project.name}</h1>
		{#if data.project.description !== ''}
			<p class="text-chalk/70">{data.project.description}</p>
		{/if}
	</div>
	{#if form?.message}
		<p class="rounded-2xl border border-signal/50 bg-signal/10 px-5 py-4 text-signal">
			{form.message}
		</p>
	{/if}
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
					assigneeName={assigneeName(task.assigneeId)}
				/>
			{/each}
		</ol>
	{/if}
</div>
