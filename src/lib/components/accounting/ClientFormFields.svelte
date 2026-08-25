<script lang="ts">
	import FormField from './FormField.svelte';
	import { inputClasses } from './accountingFormStyles';
	import type { Client } from '$lib/server/accounting/getClients';

	let { client }: { client?: Client } = $props();
</script>

<FormField label="Client name">
	<input name="name" required value={client?.name ?? ''} class={inputClasses} />
</FormField>
<FormField label="Contact name">
	<input name="contactName" value={client?.contactName ?? ''} class={inputClasses} />
</FormField>
<FormField label="Email">
	<input name="email" type="email" value={client?.email ?? ''} class={inputClasses} />
</FormField>
<FormField label="Billing address">
	<textarea name="address" rows="3" class={inputClasses}>{client?.address ?? ''}</textarea>
</FormField>
