<script lang="ts">
	import AskPanel from '$lib/components/brain/AskPanel.svelte';
	import BrainActivityLog from '$lib/components/brain/BrainActivityLog.svelte';
	import OutOfCreditsNotice from '$lib/components/workspace/OutOfCreditsNotice.svelte';
	import SourcesPanel from '$lib/components/brain/SourcesPanel.svelte';
	import WikiIndex from '$lib/components/brain/WikiIndex.svelte';

	let { data } = $props();

	let isOutOfCredits = $state(false);

	function showOutOfCredits() {
		isOutOfCredits = true;
	}
</script>

<svelte:head>
	<title>Second Brain — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
	<header class="flex flex-col gap-2">
		<p class="font-display text-sm tracking-widest text-signal uppercase">The Second Brain</p>
		<h1 class="font-display text-3xl font-medium">What your business knows</h1>
		<p class="max-w-prose text-chalk/70">
			Feed it the documents your company files. The librarian reads each one and keeps a wiki —
			one page per client, supplier, project, or topic — so any question gets an answer grounded
			in your own records.
		</p>
	</header>
	{#if isOutOfCredits}
		<div class="overflow-hidden rounded-2xl border border-hairline">
			<OutOfCreditsNotice />
		</div>
	{/if}
	<div class="grid items-start gap-6 lg:grid-cols-2">
		<div class="flex flex-col gap-6">
			<AskPanel events={data.events} pageIndex={data.pageIndex} onOutOfCredits={showOutOfCredits} />
			<BrainActivityLog events={data.events} />
		</div>
		<div class="flex flex-col gap-6">
			<SourcesPanel sources={data.sources} onOutOfCredits={showOutOfCredits} />
			<WikiIndex pageIndex={data.pageIndex} />
		</div>
	</div>
</div>
