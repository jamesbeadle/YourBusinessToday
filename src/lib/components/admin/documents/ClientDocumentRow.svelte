<script lang="ts">
	import type { ClientDocumentEntry } from '$lib/data/clientDocumentCatalogue';

	let { entry }: { entry: ClientDocumentEntry } = $props();
</script>

<li class="flex flex-wrap items-start justify-between gap-4 px-5 py-4">
	<div class="flex max-w-xl flex-col gap-1">
		<a href={`/admin/documents/${entry.slug}`} class="font-display text-chalk hover:text-signal">
			{entry.title}
		</a>
		<p class="text-sm text-chalk/60">{entry.summary}</p>
	</div>
	<div class="flex items-center gap-3">
		<a
			href={`/admin/documents/${entry.slug}`}
			class="font-display text-xs text-chalk/60 underline transition hover:text-chalk"
		>
			Read
		</a>
		<a
			href={`/admin/documents/${entry.slug}/download`}
			data-sveltekit-reload
			class="rounded-full border border-hairline px-4 py-1.5 font-display text-xs text-chalk
				transition hover:border-chalk/60"
		>
			Word
		</a>
	</div>
</li>
