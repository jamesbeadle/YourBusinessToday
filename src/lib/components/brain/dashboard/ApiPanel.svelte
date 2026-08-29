<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { requestTokenCreate, requestTokenRevoke } from './apiTokenRequests';
	import type { BrainApiToken, MintedBrainApiToken } from '$lib/data/brainApiTypes';

	let {
		brainId,
		tokens
	}: {
		brainId: string;
		tokens: BrainApiToken[];
	} = $props();

	let draftName = $state('');
	let isCreating = $state(false);
	let errorMessage = $state('');
	let minted = $state<MintedBrainApiToken | null>(null);
	let revokingId = $state<string | null>(null);
	let copiedWhat = $state<string | null>(null);

	const baseUrl = $derived(`${page.url.origin}/api/v1/brains/${brainId}`);
	const agentBriefing = $derived(
		[
			`This is my expertise brain — a curated model of one domain, organised as`,
			`bounded contexts of markdown pages. Use it as my second brain.`,
			``,
			`Base URL: ${baseUrl}`,
			`Auth header on every request: Authorization: Bearer <token>`,
			``,
			`GET  ${baseUrl}`,
			`     → the model index: every context and page with a one-line summary.`,
			`GET  ${baseUrl}/pages/{slug}`,
			`     → one page, full markdown body.`,
			`POST ${baseUrl}/ask   {"question": "..."}`,
			`     → a grounded answer citing the pages it read (spends 10 credits).`,
			`       Pass back "conversationId" from the reply to continue a thread.`,
			`GET  ${baseUrl}/export`,
			`     → the whole model as a zip of markdown files.`,
			``,
			`Navigate it yourself for detail work (index, then read the pages you`,
			`need); use /ask when you want the brain to answer in its own words.`
		].join('\n')
	);
	const curlExample = $derived(
		`curl -X POST ${baseUrl}/ask \\\n` +
			`  -H "Authorization: Bearer YOUR_TOKEN" \\\n` +
			`  -H "content-type: application/json" \\\n` +
			`  -d '{"question": "What do we know about ...?"}'`
	);

	async function createToken() {
		const name = draftName.trim();
		if (name === '' || isCreating) return;
		isCreating = true;
		errorMessage = '';
		const outcome = await requestTokenCreate(brainId, name);
		isCreating = false;
		if (!outcome.isCreated) {
			errorMessage = outcome.message;
			return;
		}
		minted = outcome.minted;
		draftName = '';
		await invalidateAll();
	}

	async function revokeToken(tokenId: string) {
		if (revokingId !== null) return;
		revokingId = tokenId;
		await requestTokenRevoke(tokenId);
		if (minted?.id === tokenId) minted = null;
		revokingId = null;
		await invalidateAll();
	}

	async function copyText(label: string, text: string) {
		await navigator.clipboard.writeText(text);
		copiedWhat = label;
		setTimeout(() => (copiedWhat = null), 1500);
	}

	function shortDate(value: string | null): string {
		if (value === null) return 'never';
		return new Date(value).toLocaleDateString();
	}
</script>

<div class="flex flex-col gap-4 p-4">
	<p class="text-sm text-chalk/60">
		Use this brain from outside the site — from Claude, a script, or any agent. A token is the
		key: send it as a bearer header and the API serves the model index, individual pages, grounded
		answers, and a markdown export. Questions asked through the API spend your credits (10 per
		question); reading pages and exporting are free.
	</p>

	<form
		class="flex items-center gap-2"
		onsubmit={(submitEvent) => {
			submitEvent.preventDefault();
			createToken();
		}}
	>
		<input
			type="text"
			bind:value={draftName}
			placeholder="Token name — e.g. Claude on my laptop"
			class="min-w-0 flex-1 rounded-xl border border-hairline bg-transparent px-3 py-2 text-sm
				text-chalk placeholder:text-chalk/30 focus:border-chalk/40 focus:outline-none"
		/>
		<button
			type="submit"
			disabled={isCreating || draftName.trim() === ''}
			class="rounded-full border border-hairline px-4 py-1.5 font-display text-xs text-chalk/70
				transition hover:border-chalk/40 hover:text-chalk disabled:opacity-40"
		>
			{isCreating ? 'Creating…' : 'Create token'}
		</button>
	</form>
	{#if errorMessage !== ''}
		<p class="text-xs text-caution">{errorMessage}</p>
	{/if}

	{#if minted !== null}
		<div class="flex flex-col gap-2 rounded-xl border border-go/40 p-3">
			<p class="text-xs text-go">
				“{minted.name}” created — copy it now, it is only shown this once.
			</p>
			<div class="flex items-center gap-2">
				<code class="min-w-0 flex-1 overflow-x-auto rounded-lg bg-chalk/5 px-2 py-1.5 font-mono
					text-xs text-chalk">{minted.token}</code>
				<button
					type="button"
					onclick={() => minted !== null && copyText('token', minted.token)}
					class="rounded-full border border-hairline px-3 py-1 font-display text-xs
						text-chalk/70 transition hover:border-chalk/40 hover:text-chalk"
				>
					{copiedWhat === 'token' ? 'Copied' : 'Copy'}
				</button>
			</div>
		</div>
	{/if}

	{#if tokens.length > 0}
		<div class="flex flex-col gap-2">
			<h3 class="font-display text-xs tracking-widest text-chalk/50 uppercase">Active tokens</h3>
			{#each tokens as token (token.id)}
				<div class="flex items-center gap-3 rounded-xl border border-hairline px-3 py-2">
					<div class="min-w-0 flex-1">
						<p class="truncate text-sm text-chalk">{token.name}</p>
						<p class="text-xs text-chalk/50">
							ybt_…{token.tokenHint} · created {shortDate(token.createdAt)} · last used
							{shortDate(token.lastUsedAt)}
						</p>
					</div>
					<button
						type="button"
						onclick={() => revokeToken(token.id)}
						disabled={revokingId !== null}
						class="rounded-full border border-hairline px-3 py-1 font-display text-xs
							text-caution/80 transition hover:border-caution/60 hover:text-caution
							disabled:opacity-40"
					>
						{revokingId === token.id ? 'Revoking…' : 'Revoke'}
					</button>
				</div>
			{/each}
		</div>
	{/if}

	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<h3 class="font-display text-xs tracking-widest text-chalk/50 uppercase">
				Give this to your agent
			</h3>
			<button
				type="button"
				onclick={() => copyText('briefing', agentBriefing)}
				class="rounded-full border border-hairline px-3 py-1 font-display text-xs text-chalk/70
					transition hover:border-chalk/40 hover:text-chalk"
			>
				{copiedWhat === 'briefing' ? 'Copied' : 'Copy'}
			</button>
		</div>
		<p class="text-xs text-chalk/50">
			Paste this into Claude (or any agent) along with a token and it knows how to navigate the
			brain — read the index, pull pages, or ask grounded questions.
		</p>
		<pre class="overflow-x-auto rounded-xl border border-hairline bg-chalk/5 p-3 font-mono
			text-xs leading-relaxed text-chalk/80">{agentBriefing}</pre>
	</div>

	<div class="flex flex-col gap-2">
		<h3 class="font-display text-xs tracking-widest text-chalk/50 uppercase">Quick test</h3>
		<pre class="overflow-x-auto rounded-xl border border-hairline bg-chalk/5 p-3 font-mono
			text-xs leading-relaxed text-chalk/80">{curlExample}</pre>
	</div>
</div>
