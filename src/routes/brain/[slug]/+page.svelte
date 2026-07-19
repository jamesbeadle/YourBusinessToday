<script lang="ts">
	import MarkdownBody from '$lib/components/brain/MarkdownBody.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.page.title} — Second Brain</title>
</svelte:head>

<article class="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-12">
	<a href="/brain" class="font-display text-sm text-chalk/60 transition hover:text-chalk">
		← Back to the brain
	</a>
	<header class="flex flex-col gap-2 border-b border-hairline pb-6">
		<p class="font-display text-xs tracking-widest text-signal uppercase">{data.page.category}</p>
		<h1 class="font-display text-3xl font-medium">{data.page.title}</h1>
		<p class="text-chalk/60">{data.page.summary}</p>
	</header>
	<MarkdownBody markdown={data.page.body} />
</article>
