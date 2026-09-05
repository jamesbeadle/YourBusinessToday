<script lang="ts">
	import FormField from '$lib/components/accounting/FormField.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { builderTierFor, builderTierLabels } from '$lib/data/builderTier';
	import { defaultStoryPoints, fibonacciStoryPoints } from '$lib/data/storyPoints';
	import { inputClasses, selectClasses } from '$lib/components/site/formStyles';

	let { defaultBrief }: { defaultBrief: string } = $props();

	let storyPoints = $state(defaultStoryPoints);

	const tierLabel = $derived(builderTierLabels[builderTierFor(storyPoints)]);
</script>

<form method="POST" action="?/acceptAndBuild" class="flex flex-col gap-4">
	<FormField label="The brief — your words, for the Builder">
		<textarea name="brief" rows="8" class={inputClasses}>{defaultBrief}</textarea>
	</FormField>
	<div class="flex flex-wrap items-end gap-4">
		<FormField label="Points">
			<select name="storyPoints" bind:value={storyPoints} class={selectClasses}>
				{#each fibonacciStoryPoints as storyPointsOption (storyPointsOption)}
					<option value={storyPointsOption}>{storyPointsOption}</option>
				{/each}
			</select>
		</FormField>
		<p class="pb-2 text-sm text-chalk/60">Goes to the {tierLabel.toLowerCase()} Builder.</p>
		<SubmitButton savingLabel="Sending…" class="ml-auto rounded-full bg-go px-6 py-2.5 font-display text-sm font-medium text-night transition hover:brightness-110">
			Accept and build
		</SubmitButton>
	</div>
	<p class="text-xs text-chalk/40">
		Creates the task, keeps the client’s words on the request, and sends your brief to build.
	</p>
</form>
