<script lang="ts">
	import { formatBritishDate } from '$lib/data/britishDate';
	import type { ClientEvent, ClientEventKind } from '$lib/server/clients/recordClientEvent';

	let { events }: { events: ClientEvent[] } = $props();

	const eventLabels: Record<ClientEventKind, string> = {
		enquiry_received: 'Enquiry received',
		stage_moved: 'Stage moved',
		contact_added: 'Contact added',
		contact_invited: 'Contact invited',
		project_assigned: 'Project assigned',
		request_raised: 'Request raised',
		request_decided: 'Request decided',
		request_promoted: 'Request promoted to a task',
		build_dispatched: 'Sent to the Builder',
		build_live: 'Build went live'
	};

	function summarise(event: ClientEvent): string {
		return Object.values(event.detail).filter(Boolean).join(' · ');
	}
</script>

<ol class="flex flex-col gap-2 text-sm">
	{#each events as event (event.id)}
		<li class="flex flex-wrap gap-x-3 text-chalk/60">
			<span class="text-chalk/40">{formatBritishDate(event.createdAt)}</span>
			<span class="text-chalk">{eventLabels[event.kind]}</span>
			<span>{summarise(event)}</span>
		</li>
	{/each}
</ol>
