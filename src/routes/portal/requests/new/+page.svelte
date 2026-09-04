<script lang="ts">
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import FormField from '$lib/components/accounting/FormField.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { inputClasses, selectClasses } from '$lib/components/site/formStyles';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Ask for something — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-16">
	<div class="flex flex-col gap-2">
		<a href="/portal" class="font-display text-sm text-chalk/50 hover:text-chalk">← Your projects</a>
		<h1 class="font-display text-3xl font-medium">Ask for something</h1>
		<p class="text-chalk/70">Tell us what you want and why. We read every one.</p>
	</div>
	<FormErrorNote message={form?.message ?? null} />
	<form method="POST" class="flex flex-col gap-4">
		<FormField label="Which project">
			<select name="projectId" required class={selectClasses}>
				{#each data.projects as project (project.id)}
					<option value={project.id} selected={project.id === data.chosenProjectId}>
						{project.name}
					</option>
				{/each}
			</select>
		</FormField>
		<FormField label="In a sentence">
			<input name="title" required class={inputClasses} />
		</FormField>
		<FormField label="What you want">
			<textarea name="want" rows="5" required class={inputClasses}></textarea>
		</FormField>
		<FormField label="So that">
			<input name="benefit" placeholder="we stop rekeying invoices" class={inputClasses} />
		</FormField>
		<SubmitButton savingLabel="Sending…">Send it</SubmitButton>
	</form>
</div>
