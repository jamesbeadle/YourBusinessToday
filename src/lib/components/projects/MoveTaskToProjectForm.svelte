<script lang="ts">
	import { enhance } from '$app/forms';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import { taskMoveWarnings } from '$lib/data/taskMove';
	import type { ProjectChoice } from '$lib/server/projects/getOtherProjects';

	let {
		otherProjects,
		onMoved
	}: {
		otherProjects: ProjectChoice[];
		onMoved: () => void;
	} = $props();

	const tracker = new FormTracker();
	const fieldClasses =
		'rounded-xl border border-hairline bg-night px-4 py-2.5 text-chalk outline-none focus:border-go';
</script>

{#if otherProjects.length === 0}
	<p class="text-sm text-chalk/70">
		There is nowhere to move it to — this is the only project you are on.
	</p>
{:else}
	<form
		method="POST"
		action="?/moveToProject"
		use:enhance={tracker.submit(onMoved)}
		class="flex flex-col gap-4"
	>
		<label class="flex flex-col gap-1">
			<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">Project</span>
			<select
				name="destinationProjectId"
				required
				value={otherProjects[0].id}
				class={fieldClasses}
			>
				{#each otherProjects as otherProject (otherProject.id)}
					<option value={otherProject.id}>{otherProject.name}</option>
				{/each}
			</select>
		</label>
		<ul
			class="flex list-disc flex-col gap-2 rounded-2xl border border-caution/40 bg-caution/10
				py-4 pr-5 pl-9 text-sm text-caution"
		>
			{#each taskMoveWarnings as warning (warning)}
				<li>{warning}</li>
			{/each}
		</ul>
		<FormErrorNote message={tracker.errorMessage} />
		<SubmitButton
			isSaving={tracker.isSaving}
			savingLabel="Moving…"
			class="self-end rounded-full bg-go px-6 py-2.5 font-display text-sm font-medium text-night
				transition hover:brightness-110"
		>
			Move task
		</SubmitButton>
	</form>
{/if}
