<script lang="ts">
	import { acceptedUploadExtensions, uploadLimitDescription } from '$lib/data/brainUploadRules';
	import { creditsPerBrainIngest } from '$lib/data/creditPricing';
	import { invalidateAll } from '$app/navigation';
	import { uploadSourceFile } from './uploadSourceFile';

	let { onOutOfCredits }: { onOutOfCredits: () => void } = $props();

	let isUploading = $state(false);
	let noticeMessage = $state('');
	let fileInput = $state<HTMLInputElement | null>(null);

	async function uploadChosenFile(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (file === undefined) return;
		isUploading = true;
		noticeMessage = '';
		const outcome = await uploadSourceFile(file);
		isUploading = false;
		input.value = '';
		if (outcome.status === 'out_of_credits') return onOutOfCredits();
		if (outcome.status !== 'ingested') noticeMessage = outcome.message;
		await invalidateAll();
	}
</script>

<div class="flex flex-col gap-3">
	<input
		bind:this={fileInput}
		type="file"
		accept={acceptedUploadExtensions}
		onchange={uploadChosenFile}
		class="hidden"
	/>
	<button
		type="button"
		disabled={isUploading}
		onclick={() => fileInput?.click()}
		class="rounded-full bg-signal px-6 py-3 font-display text-sm font-medium text-night
			transition hover:brightness-110 disabled:opacity-40"
	>
		{isUploading ? 'Reading the document…' : `Add a document — ${creditsPerBrainIngest} credits`}
	</button>
	<p class="text-xs text-chalk/50">{uploadLimitDescription()}</p>
	{#if noticeMessage !== ''}
		<p class="text-sm text-caution">{noticeMessage}</p>
	{/if}
</div>
