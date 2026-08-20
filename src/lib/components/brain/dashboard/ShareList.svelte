<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { WorkspaceInvite, WorkspaceShare } from '$lib/data/sharingTypes';

	let { shares, invites }: { shares: WorkspaceShare[]; invites: WorkspaceInvite[] } = $props();

	async function revoke(body: Record<string, string>) {
		await fetch('/api/workspace/shares', {
			method: 'DELETE',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body)
		});
		await invalidateAll();
	}

	function scopeLabel(scope: 'brain' | 'entity'): string {
		return scope === 'entity' ? 'Whole entity' : 'This brain';
	}
</script>

<ul class="flex flex-col">
	{#each shares as share (share.id)}
		<li class="flex items-center justify-between gap-3 border-b border-hairline py-2.5 last:border-b-0">
			<div class="min-w-0">
				<p class="truncate text-sm text-chalk">{share.collaboratorEmail}</p>
				<p class="font-display text-[10px] tracking-widest text-chalk/40 uppercase">
					{scopeLabel(share.scope)}
				</p>
			</div>
			<button
				type="button"
				onclick={() => revoke({ shareId: share.id })}
				aria-label={`Stop sharing with ${share.collaboratorEmail}`}
				class="rounded-full px-1.5 text-chalk/40 transition hover:bg-hairline/40 hover:text-signal"
			>
				✕
			</button>
		</li>
	{/each}
	{#each invites as invite (invite.id)}
		<li class="flex items-center justify-between gap-3 border-b border-hairline py-2.5 last:border-b-0">
			<div class="min-w-0">
				<p class="truncate text-sm text-chalk/70">{invite.invitedEmail}</p>
				<p class="font-display text-[10px] tracking-widest text-caution/70 uppercase">
					Invited · {scopeLabel(invite.scope)}
				</p>
			</div>
			<button
				type="button"
				onclick={() => revoke({ inviteId: invite.id })}
				aria-label={`Withdraw the invite for ${invite.invitedEmail}`}
				class="rounded-full px-1.5 text-chalk/40 transition hover:bg-hairline/40 hover:text-signal"
			>
				✕
			</button>
		</li>
	{/each}
</ul>
