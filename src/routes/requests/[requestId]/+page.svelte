<script lang="ts">
	import AcceptAndBuildForm from '$lib/components/requests/AcceptAndBuildForm.svelte';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import RequestDecisionForm from '$lib/components/requests/RequestDecisionForm.svelte';
	import RequestStatusPill from '$lib/components/requests/RequestStatusPill.svelte';
	import RequestThread from '$lib/components/requests/RequestThread.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { formatBritishDate } from '$lib/data/britishDate';

	let { data, form } = $props();

	const featureRequest = $derived(data.featureRequest);
</script>

<svelte:head>
	<title>{featureRequest.reference} — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-16">
	<div class="flex flex-col gap-2">
		<a href="/requests" class="font-display text-sm text-chalk/50 hover:text-chalk">← Requests</a>
		<div class="flex flex-wrap items-center gap-3">
			<h1 class="font-display text-3xl font-medium">{featureRequest.title}</h1>
			<RequestStatusPill status={featureRequest.status} isDelivered={featureRequest.isDelivered} />
		</div>
		<p class="text-chalk/70">
			{featureRequest.reference} ·
			<a href={`/clients/${featureRequest.clientId}`} class="hover:text-signal">
				{featureRequest.clientName}
			</a>
			· {featureRequest.projectName} · raised by {featureRequest.raisedByName}
			on {formatBritishDate(featureRequest.createdAt)}
		</p>
	</div>
	<FormErrorNote message={form?.message ?? null} />

	<section class="flex flex-col gap-3 rounded-2xl border border-hairline p-6">
		<h2 class="font-display text-sm tracking-widest text-chalk/50 uppercase">In their words</h2>
		<p class="whitespace-pre-wrap text-chalk/80">{featureRequest.body}</p>
		{#if featureRequest.benefit !== ''}
			<p class="text-sm text-chalk/60">So that {featureRequest.benefit}</p>
		{/if}
	</section>

	<section class="flex flex-col gap-4">
		<h2 class="font-display text-xl">Decision</h2>
		{#if featureRequest.decisionNote !== ''}
			<p class="text-sm text-chalk/60">{featureRequest.decisionNote}</p>
		{/if}
		<RequestDecisionForm />
	</section>

	<section class="flex flex-col gap-4">
		<h2 class="font-display text-xl">The work</h2>
		{#if featureRequest.taskId === null && data.canBuild}
			<AcceptAndBuildForm defaultBrief={data.defaultBrief} />
		{:else if featureRequest.taskId === null}
			<p class="text-sm text-chalk/60">
				This project has no repository recorded, so the Builder cannot take it. Promote it by hand.
			</p>
			<form method="POST" action="?/promote">
				<SubmitButton savingLabel="Creating…">Promote to a task</SubmitButton>
			</form>
		{:else}
			<a
				href={`/projects/${featureRequest.projectId}/tasks/${featureRequest.taskId}`}
				class="font-display text-go hover:brightness-110"
			>
				Open the task →
			</a>
		{/if}
	</section>

	<section class="flex flex-col gap-4">
		<h2 class="font-display text-xl">Thread</h2>
		<p class="text-xs text-chalk/40">The client can read everything posted here.</p>
		<RequestThread comments={data.comments} />
	</section>
</div>
