<script lang="ts">
	import ShareList from './ShareList.svelte';
	import { invalidateAll } from '$app/navigation';
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
		'Done — if that email has an account they now have access; otherwise an invitation email is on its way.';

	async function share(event: SubmitEvent) {
		event.preventDefault();
		if (email.trim() === '' || isSharing) return;
		isSharing = true;
		notice = null;
		const response = await fetch('/api/workspace/shares', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				email,
				brainId: scope === 'brain' ? brainId : '',
				entityId: scope === 'entity' ? entityId : ''
			})
		});
		isSharing = false;
		if (!response.ok) return (notice = { tone: 'caution', message: await messageFrom(response) });
		notice = { tone: 'go', message: NEUTRAL_CONFIRMATION };
		email = '';
		await invalidateAll();
	}

	async function messageFrom(response: Response): Promise<string> {
		const payload = await response.json().catch(() => null);
		return payload?.message ?? 'Sharing went wrong — try again.';
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
		<ShareList {shares} {invites} />
	{/if}
</div>
