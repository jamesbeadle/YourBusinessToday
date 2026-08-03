<script lang="ts">
	import { enhance } from '$app/forms';
	import TaskCommentThread from '$lib/components/projects/TaskCommentThread.svelte';
	import TaskEditForm from '$lib/components/projects/TaskEditForm.svelte';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>{data.task.title} — {data.project.name} — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16">
	<div class="flex flex-col gap-2">
		<a
			href={`/projects/${data.project.id}`}
			class="font-display text-sm text-chalk/50 transition hover:text-chalk"
		>
			← {data.project.name}
		</a>
		<h1 class="font-display text-3xl font-medium">{data.task.title}</h1>
	</div>
	{#if form?.message}
		<p class="rounded-2xl border border-go/50 bg-go/10 px-5 py-4 text-go">{form.message}</p>
	{/if}
	<TaskEditForm task={data.task} staffMembers={data.staffMembers} />
	<TaskCommentThread comments={data.comments} />
	<form
		method="POST"
		action="?/deleteTask"
		use:enhance
		class="self-end"
		onsubmit={(event) => {
			if (!confirm('Delete this task and its comments?')) event.preventDefault();
		}}
	>
		<button
			type="submit"
			class="rounded-full border border-hairline px-5 py-2 font-display text-sm text-chalk/60
				transition hover:border-signal hover:text-signal"
		>
			Delete task
		</button>
	</form>
</div>
