<script lang="ts">
	import {
		invoiceStatusClasses,
		invoiceStatusLabels,
		type InvoiceStatus
	} from '$lib/data/accounting/invoiceStatus';

	let { status }: { status: InvoiceStatus } = $props();
</script>

<span class={`rounded-full px-2.5 py-0.5 font-display text-xs ${invoiceStatusClasses[status]}`}>
	{invoiceStatusLabels[status]}
</span>
