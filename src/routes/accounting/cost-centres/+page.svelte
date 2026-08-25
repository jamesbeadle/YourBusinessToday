<script lang="ts">
	import AccountingPageHeader from '$lib/components/accounting/AccountingPageHeader.svelte';
	import ActionMessage from '$lib/components/accounting/ActionMessage.svelte';
	import ArchiveToggleRow from '$lib/components/accounting/ArchiveToggleRow.svelte';
	import EmptyState from '$lib/components/accounting/EmptyState.svelte';
	import NewNamedItemForm from '$lib/components/accounting/NewNamedItemForm.svelte';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Cost centres — Accounting</title>
</svelte:head>

<div class="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
	<AccountingPageHeader
		title="Cost centres"
		description="Tag invoice lines, expenses and journals to a cost centre, then cut the profit and loss by it in Reports."
	/>
	<ActionMessage message={form?.message} />
	<NewNamedItemForm action="?/createCostCentre" placeholder="e.g. Consulting, Product, Events" buttonLabel="Add cost centre" />
	{#if data.costCentres.length === 0}
		<EmptyState message="No cost centres yet — they're optional, add one when you want to see profit by area." />
	{:else}
		<ul class="flex flex-col divide-y divide-hairline rounded-2xl border border-hairline">
			{#each data.costCentres as costCentre (costCentre.id)}
				<ArchiveToggleRow
					idFieldName="costCentreId"
					itemId={costCentre.id}
					label={costCentre.name}
					isArchived={costCentre.isArchived}
				/>
			{/each}
		</ul>
	{/if}
</div>
