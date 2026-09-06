<script lang="ts">
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { quietButtonClasses } from '$lib/components/site/formStyles';
	import type { OfficerSearchResult } from '$lib/server/companiesHouse/officerSearchRecord';

	let { officers, addAction }: { officers: OfficerSearchResult[]; addAction: string } = $props();

	function describe(officer: OfficerSearchResult): string {
		const appointments = `${officer.appointmentCount} appointment${officer.appointmentCount === 1 ? '' : 's'}`;
		const born = officer.bornIn === '' ? '' : `born ${officer.bornIn}`;
		return [appointments, born, officer.addressSnippet].filter(Boolean).join(' · ');
	}
</script>

<ul class="divide-y divide-hairline rounded-2xl border border-hairline">
	{#each officers as officer (officer.officerId)}
		<li class="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
			<div class="min-w-0">
				<p class="font-display">{officer.name}</p>
				<p class="text-xs text-chalk/50">{describe(officer)}</p>
			</div>
			<form method="POST" action={addAction}>
				<input type="hidden" name="officerId" value={officer.officerId} />
				<input type="hidden" name="name" value={officer.name} />
				<SubmitButton class={quietButtonClasses} savingLabel="Adding…">Add as a person</SubmitButton>
			</form>
		</li>
	{/each}
</ul>
