<script lang="ts">
	import FormField from '$lib/components/accounting/FormField.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import {
		seniorityLabels,
		seniorityOrder,
		warmthLabels,
		warmthOrder
	} from '$lib/data/contactProfileFields';
	import { inputClasses, selectClasses } from '$lib/components/site/formStyles';
	import type { Person } from '$lib/server/clients/getPeopleForClient';

	let { person }: { person: Person } = $props();
</script>

<form method="POST" action="?/updateContact" class="flex flex-col gap-4">
	<input type="hidden" name="contactId" value={person.id} />
	<div class="grid gap-4 sm:grid-cols-2">
		<FormField label="Role">
			<input name="role" value={person.role} class={inputClasses} />
		</FormField>
		<FormField label="Seniority">
			<select name="seniority" value={person.seniority} class={selectClasses}>
				{#each seniorityOrder as seniority (seniority)}
					<option value={seniority}>{seniorityLabels[seniority]}</option>
				{/each}
			</select>
		</FormField>
		<FormField label="Email">
			<input name="email" type="email" value={person.email} class={inputClasses} />
		</FormField>
		<FormField label="Phone">
			<input name="phone" value={person.phone} class={inputClasses} />
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
	</div>
	<label class="flex items-center gap-2 text-sm text-chalk/70">
		<input type="checkbox" name="isDecisionMaker" checked={person.isDecisionMaker} class="accent-go" />
		Decides whether to buy
	</label>
	<SubmitButton>Save {person.name}</SubmitButton>
</form>
