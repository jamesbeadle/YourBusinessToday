<script lang="ts">
	import { enhance } from '$app/forms';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import type { AdminUserSummary } from '$lib/server/admin/getAdminUserList';

	let { user, onClose }: { user: AdminUserSummary; onClose: () => void } = $props();

	const tracker = new FormTracker();

	let dialogElement: HTMLDialogElement | undefined = $state();

	$effect(() => {
		dialogElement?.showModal();
	});
</script>

<dialog
	bind:this={dialogElement}
	onclose={onClose}
	class="m-auto w-full max-w-sm rounded-2xl border border-hairline bg-night p-6 text-chalk
		backdrop:bg-night/80"
>
	<form
		method="POST"
		action="?/grantCredits"
		use:enhance={tracker.submit(onClose)}
		class="flex flex-col gap-5"
	>
		<div class="flex flex-col gap-1">
			<h2 class="font-display text-lg font-medium">Grant credits</h2>
			<p class="text-sm text-chalk/60">{user.email} — currently {user.credits} credits.</p>
		</div>
		<input type="hidden" name="targetEmail" value={user.email} />
		<input type="hidden" name="note" value="promo" />
		<label class="flex flex-col gap-2 text-sm text-chalk/70">
			Credits to grant
			<input
				name="creditAmount"
				type="number"
				min="1"
				max="100000"
				value="1000"
				class="rounded-full border border-hairline bg-night px-4 py-2 text-chalk outline-none
					focus:border-go"
			/>
		</label>
		<FormErrorNote message={tracker.errorMessage} />
		<div class="flex justify-end gap-3">
			<button
				type="button"
				onclick={() => dialogElement?.close()}
				class="rounded-full border border-hairline px-4 py-1.5 font-display text-sm text-chalk/70
					transition hover:border-chalk/40 hover:text-chalk"
			>
				Cancel
			</button>
			<SubmitButton
				isSaving={tracker.isSaving}
				savingLabel="Granting…"
				class="rounded-full border border-go/60 px-4 py-1.5 font-display text-sm text-go
					transition hover:bg-go hover:text-night"
			>
				Grant
			</SubmitButton>
		</div>
	</form>
</dialog>
