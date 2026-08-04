<script lang="ts">
	import NewSprintForm from '$lib/components/projects/NewSprintForm.svelte';
	import SprintCard from '$lib/components/projects/SprintCard.svelte';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Sprints — {data.project.name} — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16">
	<div class="flex flex-col gap-2">
		<a
			href={`/projects/${data.project.id}`}
			class="font-display text-sm text-chalk/50 transition hover:text-chalk"
		>
			← {data.project.name}
		</a>
		<h1 class="font-display text-3xl font-medium">Sprints</h1>
		<p class="text-chalk/70">
			Group tasks from any phase into a sprint — assign a task to a sprint from its detail page.
		</p>
	</div>
	{#if form?.message}
		<p class="rounded-2xl border border-go/50 bg-go/10 px-5 py-4 text-go">
			{form.message}
		</p>
	{/if}
	<NewSprintForm />
	{#if data.sprintSummaries.length === 0}
		<p class="rounded-2xl border border-dashed border-hairline p-8 text-center text-chalk/60">
			No sprints yet — create the first one above.
		</p>
	{:else}
		<ul class="grid gap-4 md:grid-cols-2">
			{#each data.sprintSummaries as sprintSummary (sprintSummary.id)}
				<SprintCard {sprintSummary} />
			{/each}
		</ul>
	{/if}
</div>
