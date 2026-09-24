<script lang="ts">
	let { documentHtml }: { documentHtml: string } = $props();
</script>

<div class="document-prose flex flex-col gap-4 text-chalk/80 print:text-black">
	{@html documentHtml}
</div>

<style>
	.document-prose :global(h1) {
		font-family: var(--font-display);
		font-size: 2.25rem;
		line-height: 1.2;
		color: var(--color-chalk);
	}
	.document-prose :global(h2) {
		font-family: var(--font-display);
		font-size: 1.4rem;
		margin-top: 1.5rem;
		color: var(--color-chalk);
	}
	.document-prose :global(h3) {
		font-family: var(--font-display);
		font-size: 1.1rem;
		margin-top: 1rem;
		color: var(--color-chalk);
	}
	.document-prose :global(ul),
	.document-prose :global(ol) {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding-left: 1.5rem;
		list-style: disc;
	}
	.document-prose :global(ol) {
		list-style: decimal;
	}
	.document-prose :global(blockquote) {
		border-left: 3px solid var(--color-hairline);
		padding-left: 1rem;
	}
	.document-prose :global(table) {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}
	.document-prose :global(th),
	.document-prose :global(td) {
		border: 1px solid var(--color-hairline);
		padding: 0.4rem 0.6rem;
		text-align: left;
		vertical-align: top;
	}
	.document-prose :global(hr) {
		border-color: var(--color-hairline);
	}
	@media print {
		.document-prose :global(h1),
		.document-prose :global(h2),
		.document-prose :global(h3) {
			color: black;
		}
	}
</style>
