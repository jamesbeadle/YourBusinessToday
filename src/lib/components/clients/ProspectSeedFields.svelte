<script lang="ts">
	import type { CompaniesHouseCompany } from '$lib/server/companiesHouse/searchCompaniesHouse';

	let { company }: { company: CompaniesHouseCompany } = $props();
</script>

<input type="hidden" name="name" value={company.name} />
<input type="hidden" name="companyNumber" value={company.companyNumber} />
<input type="hidden" name="address" value={company.address} />
<input type="hidden" name="postcode" value={company.postcode} />
