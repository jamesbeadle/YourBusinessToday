<script lang="ts">
	import { inputClasses } from '$lib/components/site/formStyles';
	import type { ResearchedPerson } from '$lib/server/clients/researchedProfile';

	let { people }: { people: ResearchedPerson[] } = $props();
</script>

<div class="flex flex-col gap-3">
	<h3 class="font-display text-lg">People named on the site</h3>
	{#if people.length === 0}
		<p class="text-sm text-chalk/50">The site names nobody. Add people on the client page.</p>
	{/if}
	{#each people as person, index (index)}
		<div class="flex flex-wrap items-center gap-3 rounded-xl border border-hairline px-4 py-3">
			<input
				type="checkbox"
				name="personIncluded"
				value={index}
				checked
				aria-label={`Include ${person.name}`}
				class="accent-go"
			/>
			<input
				name="personName"
				value={person.name}
				aria-label="Name"
				class={`${inputClasses} min-w-0 flex-1 py-1 text-sm`}
			/>
			<input
				name="personRole"
				value={person.role}
				aria-label="Role"
				placeholder="Role"
				class={`${inputClasses} min-w-0 flex-1 py-1 text-sm`}
			/>
			<input type="hidden" name="personSourceUrl" value={person.evidenceUrl} />
			<a href={person.evidenceUrl} target="_blank" rel="noreferrer" class="text-xs text-chalk/40 hover:text-signal">
				source
			</a>
		</div>
	{/each}
</div>
