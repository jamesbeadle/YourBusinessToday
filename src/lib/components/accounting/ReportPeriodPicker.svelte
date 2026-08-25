<script lang="ts">
	import { confirmButtonClasses, inputClasses, selectClasses } from './accountingFormStyles';
	import type { CostCentre } from '$lib/server/accounting/getCostCentres';

	let {
		monthKey,
		costCentreId,
		costCentres
	}: { monthKey: string; costCentreId: string | null; costCentres: CostCentre[] } = $props();
</script>

<form method="GET" class="flex flex-wrap items-end gap-3 print:hidden">
	<label class="flex flex-col gap-2 text-sm text-chalk/70">
		Month
		<input name="month" type="month" value={monthKey} class={inputClasses} />
	</label>
	<label class="flex flex-col gap-2 text-sm text-chalk/70">
		Cost centre
		<select name="costCentre" value={costCentreId ?? ''} class={selectClasses}>
			<option value="">Whole business</option>
			{#each costCentres as costCentre (costCentre.id)}
				<option value={costCentre.id}>{costCentre.name}</option>
			{/each}
		</select>
	</label>
	<button type="submit" class={confirmButtonClasses}>Show</button>
</form>
