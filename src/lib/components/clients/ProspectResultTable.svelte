<script lang="ts">
	import ProspectSeedFields from './ProspectSeedFields.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { formatBritishDate } from '$lib/data/britishDate';
	import { confirmButtonClasses, quietButtonClasses } from '$lib/components/site/formStyles';
	import type { CompaniesHouseCompany } from '$lib/server/companiesHouse/searchCompaniesHouse';

	let {
		companies,
		addLeadAction,
		addWithDirectorsAction
	}: { companies: CompaniesHouseCompany[]; addLeadAction: string; addWithDirectorsAction: string } = $props();

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
			<div class="flex flex-wrap gap-2">
				<form method="POST" action={addLeadAction}>
					<ProspectSeedFields {company} />
					<SubmitButton class={quietButtonClasses} savingLabel="Adding…">Add as lead</SubmitButton>
				</form>
				<form method="POST" action={addWithDirectorsAction}>
					<ProspectSeedFields {company} />
					<SubmitButton class={confirmButtonClasses} savingLabel="Adding…">Add with directors</SubmitButton>
				</form>
			</div>
		</li>
	{/each}
</ul>
