<script lang="ts">
	import ClientStageForm from './ClientStageForm.svelte';
	import type { ClientSummary } from '$lib/server/clients/getClientList';

	let { clients }: { clients: ClientSummary[] } = $props();
</script>

<ul class="divide-y divide-hairline rounded-2xl border border-hairline">
	{#each clients as client (client.id)}
		<li class="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
			<div class="min-w-0">
				<a href={`/clients/${client.id}`} class="font-display hover:text-signal">{client.name}</a>
				<p class="text-xs text-chalk/50">
					{client.primaryContactName === '' ? 'No contact yet' : client.primaryContactName}
					· {client.projectCount} project{client.projectCount === 1 ? '' : 's'}
					{#if client.openRequestCount > 0}
						· <span class="text-signal">{client.openRequestCount} awaiting triage</span>
					{/if}
				</p>
			</div>
			<ClientStageForm clientId={client.id} stage={client.stage} />
		</li>
	{/each}
</ul>
