<script lang="ts">
	import BrainActivityLog from '$lib/components/brain/BrainActivityLog.svelte';
	import BrainConversationPanel from '$lib/components/brain/BrainConversationPanel.svelte';
	import DomainModelIndex from '$lib/components/brain/DomainModelIndex.svelte';
	import OutOfCreditsNotice from '$lib/components/workspace/OutOfCreditsNotice.svelte';
	import SourcesPanel from '$lib/components/brain/SourcesPanel.svelte';

	let { data } = $props();

	let isOutOfCredits = $state(false);

	function showOutOfCredits() {
		isOutOfCredits = true;
	}
</script>

<svelte:head>
	<title>Domain Brain — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
	<header class="flex flex-wrap items-end justify-between gap-4">
		<div class="flex flex-col gap-2">
			<p class="font-display text-sm tracking-widest text-signal uppercase">The Domain Brain</p>
			<h1 class="font-display text-3xl font-medium">A model of your business</h1>
			<p class="max-w-prose text-chalk/70">
				Feed it the documents your company files. The modeller reads each one and keeps a domain
				model — bounded contexts, the things you track, the language you speak — so any
				conversation is grounded in your own records.
			</p>
		</div>
		<a
			href="/api/brain/export"
			download
			class="rounded-full border border-hairline px-5 py-2 font-display text-sm text-chalk/80
				transition hover:border-chalk/40 hover:text-chalk"
		>
			Export as Markdown
		</a>
	</header>
	{#if isOutOfCredits}
		<div class="overflow-hidden rounded-2xl border border-hairline">
			<OutOfCreditsNotice />
		</div>
	{/if}
	<div class="grid items-start gap-6 lg:grid-cols-2">
		<div class="flex flex-col gap-6">
			<BrainConversationPanel
				conversationId={data.conversation.conversationId}
				messages={data.conversation.messages}
				pageIndex={data.pageIndex}
				onOutOfCredits={showOutOfCredits}
			/>
			<BrainActivityLog events={data.events} />
		</div>
		<div class="flex flex-col gap-6">
			<SourcesPanel sources={data.sources} onOutOfCredits={showOutOfCredits} />
			<DomainModelIndex contexts={data.contexts} pageIndex={data.pageIndex} />
		</div>
	</div>
</div>
