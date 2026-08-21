<script lang="ts">
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import type { HiveReviewApplication } from '$lib/server/hive/hiveReview';

	let { application }: { application: HiveReviewApplication } = $props();

	const approveTracker = new FormTracker();
	const rejectTracker = new FormTracker();

	const appliedDate = $derived(new Date(application.createdAt).toLocaleDateString('en-GB'));
</script>

<li class="flex flex-col gap-3 p-5">
	<div class="flex flex-wrap items-baseline justify-between gap-2">
		<h3 class="font-display text-lg font-medium">{application.brainName}</h3>
		<p class="font-display text-xs text-chalk/50">
			{application.ownerEmail} · applied {appliedDate}
		</p>
	</div>
	<p class="text-sm text-chalk/70">{application.pitch}</p>
	<p class="font-display text-xs text-chalk/50">
		{application.contextCount}
		{application.contextCount === 1 ? 'context' : 'contexts'} · {application.pageCount}
		{application.pageCount === 1 ? 'page' : 'pages'}
	</p>
	<FormErrorNote message={approveTracker.errorMessage ?? rejectTracker.errorMessage} />
	<div class="flex flex-wrap items-center gap-3">
		<form method="POST" action="?/approveHiveApplication" use:enhance={approveTracker.submit()}>
			<input type="hidden" name="applicationId" value={application.applicationId} />
			<SubmitButton
				isSaving={approveTracker.isSaving}
				savingLabel="Approving…"
				class="rounded-full bg-go px-5 py-2 font-display text-sm font-medium text-night
					transition hover:brightness-110"
			>
				Approve & snapshot
			</SubmitButton>
		</form>
		<form
			method="POST"
			action="?/rejectHiveApplication"
			use:enhance={rejectTracker.submit()}
			class="flex flex-1 items-center gap-2"
		>
			<input type="hidden" name="applicationId" value={application.applicationId} />
			<input
				name="note"
				placeholder="Reason (shown to the owner)"
				aria-label="Rejection reason"
				class="min-w-0 flex-1 rounded-full border border-hairline bg-night px-4 py-2 text-sm
					text-chalk outline-none placeholder:text-chalk/40 focus:border-signal"
			/>
			<SubmitButton
				isSaving={rejectTracker.isSaving}
				savingLabel="Rejecting…"
				class="rounded-full border border-signal/60 px-5 py-2 font-display text-sm text-signal
					transition hover:bg-signal hover:text-night"
			>
				Reject
			</SubmitButton>
		</form>
	</div>
</li>
