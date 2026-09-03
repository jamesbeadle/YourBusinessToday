<script lang="ts">
	import { enhance } from '$app/forms';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import type { ChatbotMember, ChatbotSummary } from '$lib/data/chatbotTypes';

	let { chatbot, members }: { chatbot: ChatbotSummary; members: ChatbotMember[] } = $props();

	const tracker = new FormTracker();
	let credits = $state(0);
	let allowances = $state<Record<string, number>>(
		Object.fromEntries(members.map((member) => [member.id, member.allowanceCredits]))
	);

	const allowanceTotal = $derived(
		members.reduce((total, member) => total + (allowances[member.id] ?? 0), 0)
	);
	const poolAfter = $derived(chatbot.poolCredits + credits);
	const isOverAllocated = $derived(allowanceTotal > poolAfter);
</script>

<form
	method="POST"
	action="?/topUp"
	use:enhance={tracker.submit()}
	class="flex flex-col gap-4 rounded-2xl border border-hairline bg-carriage p-5"
>
	<div class="flex flex-col gap-1">
		<h2 class="font-display text-lg font-medium">Top up</h2>
		<p class="text-sm text-chalk/60">
			Credits move from your balance into the pool. Every member's period starts again with the
			allowance you confirm here.
		</p>
	</div>
	<label class="flex items-center gap-3 text-sm">
		<span class="w-40 text-chalk/70">Credits to add</span>
		<input
			type="number"
			name="credits"
			min="1"
			step="1"
			required
			bind:value={credits}
			class="w-32 rounded-xl border border-hairline bg-night px-4 py-2 font-mono text-chalk
				outline-none focus:border-signal"
		/>
	</label>
	{#if members.length > 0}
		<div class="flex flex-col gap-2">
			<p class="text-[10px] tracking-wider text-chalk/40 uppercase">Allowance per member</p>
			{#each members as member (member.id)}
				<label class="flex items-center gap-3 text-sm">
					<span class="w-40 truncate text-chalk/70 sm:w-64">{member.invitedEmail}</span>
					<input
						type="number"
						name={`allowance:${member.id}`}
						min="0"
						step="1"
						bind:value={allowances[member.id]}
						class="w-32 rounded-xl border border-hairline bg-night px-4 py-2 font-mono text-chalk
							outline-none focus:border-signal"
					/>
				</label>
			{/each}
		</div>
		<p class={`text-xs ${isOverAllocated ? 'text-caution' : 'text-chalk/50'}`}>
			Allowances total {allowanceTotal} of a {poolAfter}-credit pool{isOverAllocated
				? ' — that is fine, but the bot stops answering when the pool runs dry.'
				: '.'}
		</p>
	{/if}
	<FormErrorNote message={tracker.errorMessage} />
	<SubmitButton
		isSaving={tracker.isSaving}
		savingLabel="Topping up…"
		disabled={credits <= 0}
		class="self-start rounded-full bg-signal px-6 py-2.5 font-display text-sm font-medium
			text-night transition hover:brightness-110 disabled:opacity-40"
	>
		{credits > 0 ? `Top up ${credits} credits` : 'Top up'}
	</SubmitButton>
</form>
