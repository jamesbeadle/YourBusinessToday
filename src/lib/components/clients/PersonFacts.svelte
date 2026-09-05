<script lang="ts">
	import WarmthPill from './WarmthPill.svelte';
	import { formatBritishDate } from '$lib/data/britishDate';
	import { seniorityLabels } from '$lib/data/contactProfileFields';
	import type { Person } from '$lib/server/clients/getPeopleForClient';

	let { person }: { person: Person } = $props();

	const lastContacted = $derived(
		person.lastContactedOn === null ? 'Never contacted' : `Last contacted ${formatBritishDate(person.lastContactedOn)}`
	);
	const nextActionDue = $derived(
		person.nextActionDue === null ? '' : ` by ${formatBritishDate(person.nextActionDue)}`
	);
</script>

<div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-chalk/60">
	<WarmthPill warmth={person.warmth} />
	<span>{seniorityLabels[person.seniority]}</span>
	{#if person.isDecisionMaker}
		<span class="text-go">Decision maker</span>
	{/if}
	<span>{lastContacted}</span>
</div>
{#if person.nextAction !== ''}
	<p class="text-sm text-chalk/80">
		<span class="text-chalk/50">Next:</span>
		{person.nextAction}{nextActionDue}
	</p>
{/if}
