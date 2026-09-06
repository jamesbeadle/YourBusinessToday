<script lang="ts">
	import FormField from '$lib/components/accounting/FormField.svelte';
	import {
		seniorityLabels,
		seniorityOrder,
		warmthLabels,
		warmthOrder
	} from '$lib/data/contactProfileFields';
	import { inputClasses, selectClasses } from '$lib/components/site/formStyles';
	import type { PersonProfile } from '$lib/server/people/personRecord';

	let { person }: { person: PersonProfile } = $props();
</script>

<FormField label="Seniority">
	<select name="seniority" value={person.seniority} class={selectClasses}>
		{#each seniorityOrder as seniority (seniority)}
			<option value={seniority}>{seniorityLabels[seniority]}</option>
		{/each}
	</select>
</FormField>
<FormField label="Warmth">
	<select name="warmth" value={person.warmth} class={selectClasses}>
		{#each warmthOrder as warmth (warmth)}
			<option value={warmth}>{warmthLabels[warmth]}</option>
		{/each}
	</select>
</FormField>
<FormField label="Last contacted">
	<input name="lastContactedOn" type="date" value={person.lastContactedOn ?? ''} class={inputClasses} />
</FormField>
<FormField label="Next action">
	<input name="nextAction" value={person.nextAction} placeholder="Call after the trade show" class={inputClasses} />
</FormField>
<FormField label="Due">
	<input name="nextActionDue" type="date" value={person.nextActionDue ?? ''} class={inputClasses} />
</FormField>
