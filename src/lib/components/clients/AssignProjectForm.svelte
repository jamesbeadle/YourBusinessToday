<script lang="ts">
	import FormField from '$lib/components/accounting/FormField.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { inputClasses, selectClasses } from '$lib/components/site/formStyles';
	import type { UnassignedProject } from '$lib/server/projects/getUnassignedProjects';

	let { projects }: { projects: UnassignedProject[] } = $props();
</script>

{#if projects.length === 0}
	<p class="text-sm text-chalk/60">Every project already belongs to someone.</p>
{:else}
	<form method="POST" action="?/assignProject" class="flex flex-col gap-4">
		<FormField label="Project">
			<select name="projectId" required class={selectClasses}>
				{#each projects as project (project.id)}
					<option value={project.id}>{project.name}</option>
				{/each}
			</select>
		</FormField>
		<FormField label="Repository">
			<input name="repositoryUrl" placeholder="https://github.com/..." class={inputClasses} />
		</FormField>
		<FormField label="Live URL">
			<input name="environmentUrl" placeholder="https://" class={inputClasses} />
		</FormField>
		<SubmitButton>Assign to this client</SubmitButton>
	</form>
{/if}
