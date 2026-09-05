<script lang="ts">
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { inputClasses, panelClasses } from '$lib/components/site/formStyles';
	import type { CompaniesHouseSearch } from '$lib/server/clients/searchCompaniesHouse';

	let { search }: { search: CompaniesHouseSearch | null } = $props();
</script>

<form method="GET" class={panelClasses}>
	<div class="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
		<label class="flex flex-col gap-2 text-sm text-chalk/70">
			SIC codes
			<input
				name="sicCodes"
				value={search?.sicCodes.join(', ') ?? ''}
				placeholder="41100, 43390"
				class={inputClasses}
			/>
		</label>
		<label class="flex flex-col gap-2 text-sm text-chalk/70">
			Location
			<input name="location" value={search?.location ?? ''} placeholder="Guildford" class={inputClasses} />
		</label>
		<SubmitButton>Search</SubmitButton>
	</div>
	<p class="text-xs text-chalk/50">
		Active companies only, straight from the Companies House register. Separate SIC codes with
		commas.
	</p>
</form>
