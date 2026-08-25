<script lang="ts">
	import type { Client } from '$lib/server/accounting/getClients';

	let { client }: { client: Client } = $props();
</script>

<li class="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
	<div class="min-w-0">
		<a href={`/accounting/clients/${client.id}`} class="font-display hover:text-signal">
			{client.name}
			{#if client.isArchived}
				<span class="ml-2 rounded-full bg-chalk/10 px-2 py-0.5 text-xs text-chalk/60">archived</span>
			{/if}
		</a>
		<p class="text-xs text-chalk/50">{[client.contactName, client.email].filter(Boolean).join(' · ')}</p>
	</div>
	<a
		href={`/accounting/invoices?new=1&clientId=${client.id}`}
		class="font-display text-sm text-chalk/60 transition hover:text-signal"
	>
		Raise invoice →
	</a>
</li>
