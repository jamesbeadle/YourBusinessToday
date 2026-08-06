<script lang="ts">
	import { enhance } from '$app/forms';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import { projectStatusLabels, projectStatusOrder } from '$lib/data/projectStatus';
	import type { Project } from '$lib/server/projects/projectRecord';

	let { project, onSaved }: { project: Project; onSaved: () => void } = $props();

	const tracker = new FormTracker();

	const fieldClasses =
		'rounded-xl border border-hairline bg-night px-4 py-2.5 text-chalk outline-none focus:border-go';
</script>

<form
	method="POST"
	action="?/updateProject"
	use:enhance={tracker.submit(onSaved)}
	class="flex flex-col gap-4"
>
	<input type="hidden" name="projectId" value={project.id} />
	<label class="flex flex-col gap-1">
		<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">Name</span>
		<input name="name" required value={project.name} class={fieldClasses} />
	</label>
	<label class="flex flex-col gap-1">
		<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">Description</span>
		<textarea name="description" rows="3" class={fieldClasses}>{project.description}</textarea>
	</label>
	<label class="flex max-w-48 flex-col gap-1">
		<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">Status</span>
		<select name="status" value={project.status} class={fieldClasses}>
			{#each projectStatusOrder as statusValue (statusValue)}
				<option value={statusValue}>{projectStatusLabels[statusValue]}</option>
			{/each}
		</select>
	</label>
	<FormErrorNote message={tracker.errorMessage} />
	<SubmitButton
		isSaving={tracker.isSaving}
		class="self-end rounded-full bg-go px-6 py-2.5 font-display text-sm font-medium text-night
			transition hover:brightness-110"
	>
		Save
	</SubmitButton>
</form>
