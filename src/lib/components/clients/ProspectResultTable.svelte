<script lang="ts">
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { formatBritishDate } from '$lib/data/britishDate';
	import { quietButtonClasses } from '$lib/components/site/formStyles';
	import type { CompaniesHouseCompany } from '$lib/server/clients/searchCompaniesHouse';

	let {
		companies,
		addLeadAction
	}: { companies: CompaniesHouseCompany[]; addLeadAction: string } = $props();

	function describe(company: CompaniesHouseCompany): string {
		const incorporated =
			company.incorporatedOn === '' ? '' : `Incorporated ${formatBritishDate(company.incorporatedOn)}`;
		return [company.companyNumber, incorporated, company.address, company.sicCodes.join(' ')]
			.filter(Boolean)
			.join(' · ');
	}
</script>

<ul class="divide-y divide-hairline rounded-2xl border border-hairline">
	{#each companies as company (company.companyNumber)}
		<li class="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
			<div class="min-w-0">
				<p class="font-display">{company.name}</p>
				<p class="text-xs text-chalk/50">{describe(company)}</p>
			</div>
			<form method="POST" action={addLeadAction}>
				<input type="hidden" name="name" value={company.name} />
				<input type="hidden" name="companyNumber" value={company.companyNumber} />
				<input type="hidden" name="address" value={company.address} />
				<SubmitButton class={quietButtonClasses} savingLabel="Adding…">Add as lead</SubmitButton>
			</form>
		</li>
	{/each}
</ul>
