<script lang="ts">
	import type { CostCentre } from '$lib/server/accounting/getCostCentres';
	import { selectClasses } from './accountingFormStyles';

	let {
		name = 'costCentreId',
		costCentres,
		value = ''
	}: { name?: string; costCentres: CostCentre[]; value?: string | null } = $props();
</script>

<select {name} value={value ?? ''} class={selectClasses}>
	<option value="">No cost centre</option>
	{#each costCentres as costCentre (costCentre.id)}
		<option value={costCentre.id}>{costCentre.name}</option>
	{/each}
</select>
