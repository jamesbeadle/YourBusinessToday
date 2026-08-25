<script lang="ts">
	import AccountingPageHeader from '$lib/components/accounting/AccountingPageHeader.svelte';
	import AccountingSettingsForm from '$lib/components/accounting/AccountingSettingsForm.svelte';
	import ActionMessage from '$lib/components/accounting/ActionMessage.svelte';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Settings — Accounting</title>
</svelte:head>

<div class="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
	<AccountingPageHeader
		title="Settings"
		description="What appears on your invoices, your payment terms, and when your financial year starts."
	/>
	<ActionMessage message={form?.message} />
	<AccountingSettingsForm settings={data.settings} />
</div>
