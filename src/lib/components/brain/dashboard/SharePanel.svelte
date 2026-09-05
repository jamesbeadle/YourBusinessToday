<script lang="ts">
	import ShareList from './ShareList.svelte';
	import { invalidateAll } from '$app/navigation';
	import { requestShare } from './shareRequests';
	import { undeliveredInviteNotice } from '$lib/data/emailDelivery';
	import type { MergedGrant } from './shareGrouping';
	import type { ShareOutcome } from './shareRequests';
	import type { ShareScope, WorkspaceInvite, WorkspaceShare } from '$lib/data/sharingTypes';

	let {
		brainId,
		entityId,
		shares,
		invites
	}: {
		brainId: string;
		entityId: string;
		shares: WorkspaceShare[];
		invites: WorkspaceInvite[];
	} = $props();

	let email = $state('');
	let scope = $state<ShareScope>('brain');
	let isSharing = $state(false);
	let notice = $state<{ tone: 'go' | 'caution'; message: string } | null>(null);

	const NEUTRAL_CONFIRMATION =
		'Invitation sent — they get access as soon as they accept it.';

	async function share(event: SubmitEvent) {
		event.preventDefault();
		if (email.trim() === '' || isSharing) return;
		isSharing = true;
		notice = null;
		const outcome = await requestShare(email, scope, brainId, entityId);
		isSharing = false;
		notice = describeOutcome(outcome, NEUTRAL_CONFIRMATION);
		if (!outcome.isShared) return;
		email = '';
		await invalidateAll();
	}

	async function resendInvite(invite: MergedGrant) {
		notice = null;
		const outcome = await requestShare(invite.email, invite.scope, brainId, entityId);
		notice = describeOutcome(outcome, `Invitation re-sent to ${invite.email}.`);
	}

	function describeOutcome(outcome: ShareOutcome, confirmation: string) {
		if (!outcome.isShared) return { tone: 'caution' as const, message: outcome.message };
		const undelivered = undeliveredInviteNotice(outcome.emailDelivery);
		if (undelivered !== null) return { tone: 'caution' as const, message: undelivered };
		return { tone: 'go' as const, message: confirmation };
	}
</script>

<div class="flex flex-col gap-4 p-4">
	<p class="text-sm text-chalk/60">
		Collaborators explore the brain and ask questions on their own credits. Documents they add
		become proposed changes you review before they enter the model.
	</p>
	<form onsubmit={share} class="flex flex-col gap-2">
		<input
			bind:value={email}
			type="email"
			placeholder="collaborator@company.co.uk"
			class="rounded-xl border border-hairline bg-night px-3 py-2 text-sm text-chalk
				placeholder-chalk/30 outline-none focus:border-chalk/40"
		/>
		<div class="flex gap-1.5">
			{#each [{ value: 'brain', label: 'This brain' }, { value: 'entity', label: 'Whole entity' }] as choice (choice.value)}
				<button
					type="button"
					onclick={() => (scope = choice.value as ShareScope)}
					aria-pressed={scope === choice.value}
					class={`rounded-full border px-3 py-1 font-display text-xs transition ${
						scope === choice.value
							? 'border-chalk/40 bg-hairline/50 text-chalk'
							: 'border-hairline text-chalk/60 hover:text-chalk'
					}`}
				>
					{choice.label}
				</button>
			{/each}
		</div>
		<button
			type="submit"
			disabled={isSharing}
			class="rounded-full bg-signal px-5 py-2 font-display text-xs font-medium text-night
				transition hover:brightness-110 disabled:opacity-40"
		>
			{isSharing ? 'Sharing…' : 'Share'}
		</button>
		{#if notice !== null}
			<p class={`text-xs ${notice.tone === 'go' ? 'text-go' : 'text-caution'}`}>
				{notice.message}
			</p>
		{/if}
	</form>
	{#if shares.length > 0 || invites.length > 0}
		<ShareList {shares} {invites} onResend={resendInvite} />
	{/if}
</div>
