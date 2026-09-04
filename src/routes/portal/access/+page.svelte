<script lang="ts">
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import FormField from '$lib/components/accounting/FormField.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { formatBritishDate } from '$lib/data/britishDate';
	import { inputClasses, quietButtonClasses } from '$lib/components/site/formStyles';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Connect Claude — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-16">
	<div class="flex flex-col gap-2">
		<a href="/portal" class="font-display text-sm text-chalk/50 hover:text-chalk">← Your projects</a>
		<h1 class="font-display text-3xl font-medium">Connect Claude</h1>
		<p class="text-chalk/70">
			Give your own Claude an access token and it can list your projects, raise feature
			requests, and follow their threads without you opening this site.
		</p>
	</div>

	<section class="flex flex-col gap-2 rounded-2xl border border-hairline p-6">
		<h2 class="font-display text-sm tracking-widest text-chalk/50 uppercase">Server address</h2>
		<code class="text-sm break-all text-chalk/80">{data.serverUrl}</code>
	</section>

	<FormErrorNote message={form?.message ?? null} />

	{#if form?.mintedToken}
		<section class="flex flex-col gap-2 rounded-2xl border border-go/50 bg-go/10 p-6">
			<h2 class="font-display text-go">Your new token</h2>
			<code class="text-sm break-all text-chalk">{form.mintedToken}</code>
			<p class="text-xs text-chalk/60">
				Copy it now — we store only a fingerprint, so this is the one time it is shown.
			</p>
		</section>
	{/if}

	<form method="POST" action="?/createToken" class="flex flex-col gap-4">
		<FormField label="What is this token for?">
			<input name="name" placeholder="My laptop" required class={inputClasses} />
		</FormField>
		<SubmitButton savingLabel="Minting…">Create a token</SubmitButton>
	</form>

	{#if data.tokens.length > 0}
		<ul class="divide-y divide-hairline rounded-2xl border border-hairline">
			{#each data.tokens as token (token.id)}
				<li class="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
					<div>
						<p class="font-display">{token.name} <span class="text-chalk/40">…{token.tokenHint}</span></p>
						<p class="text-xs text-chalk/50">
							Created {formatBritishDate(token.createdAt)}
							{#if token.lastUsedAt !== null}· last used {formatBritishDate(token.lastUsedAt)}{/if}
						</p>
					</div>
					<form method="POST" action="?/revokeToken">
						<input type="hidden" name="tokenId" value={token.id} />
						<SubmitButton class={quietButtonClasses} savingLabel="Revoking…">Revoke</SubmitButton>
					</form>
				</li>
			{/each}
		</ul>
	{/if}
</div>
