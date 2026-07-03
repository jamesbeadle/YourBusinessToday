<script lang="ts">
	import { enhance } from '$app/forms';
	import type { AdminUserSummary } from '$lib/server/admin/getAdminUserList';

	let { user }: { user: AdminUserSummary } = $props();
</script>

<li class="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
	<div class="min-w-0">
		<p class="truncate font-display">
			{user.email}
			{#if user.isAdmin}
				<span class="ml-2 rounded-full bg-signal/15 px-2 py-0.5 text-xs text-signal">admin</span>
			{/if}
			{#if user.isRestricted}
				<span class="ml-2 rounded-full bg-caution/15 px-2 py-0.5 text-xs text-caution">
					restricted
				</span>
			{/if}
		</p>
		<p class="text-xs text-chalk/50">{user.credits} credits</p>
	</div>
	<div class="flex flex-wrap items-center gap-3">
		<form method="POST" action="?/grantCredits" use:enhance class="flex items-center gap-2">
			<input type="hidden" name="targetEmail" value={user.email} />
			<input type="hidden" name="note" value="promo" />
			<input
				name="creditAmount"
				type="number"
				min="1"
				max="1000"
				value="10"
				aria-label={`Credits to grant ${user.email}`}
				class="w-20 rounded-full border border-hairline bg-night px-3 py-1.5 text-sm text-chalk
					outline-none focus:border-go"
			/>
			<button
				type="submit"
				class="rounded-full border border-go/60 px-4 py-1.5 font-display text-sm text-go
					transition hover:bg-go hover:text-night"
			>
				Grant
			</button>
		</form>
		<form method="POST" action="?/setRestriction" use:enhance>
			<input type="hidden" name="targetEmail" value={user.email} />
			<input type="hidden" name="shouldRestrict" value={user.isRestricted ? 'false' : 'true'} />
			<button
				type="submit"
				class="rounded-full border border-hairline px-4 py-1.5 font-display text-sm text-chalk/70
					transition hover:border-caution hover:text-caution"
			>
				{user.isRestricted ? 'Unrestrict' : 'Restrict'}
			</button>
		</form>
	</div>
</li>
