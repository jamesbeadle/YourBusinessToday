<script lang="ts">
	import TemplateCard from './TemplateCard.svelte';
	import {
		brainTemplatesInCategory,
		type BrainTemplate,
		type BrainTemplateCategory
	} from '$lib/data/brainTemplates';

	let {
		category,
		onSelect
	}: {
		category: BrainTemplateCategory;
		onSelect: (template: BrainTemplate) => void;
	} = $props();
</script>

<section class="flex flex-col gap-4">
	<div class="flex flex-col gap-1">
		<div class="flex items-center gap-3">
			<span
				aria-hidden="true"
				class="h-3.5 w-3.5 shrink-0 rounded-full border-[3px] bg-night"
				style={`border-color: ${category.accentColor}`}
			></span>
			<h2 class="font-display text-lg font-medium whitespace-nowrap">{category.title}</h2>
			<span
				aria-hidden="true"
				class="h-[3px] flex-1 rounded-full"
				style={`background: color-mix(in srgb, ${category.accentColor} 35%, transparent)`}
			></span>
		</div>
		<p class="pl-[26px] text-sm text-chalk/50">{category.tagline}</p>
	</div>
	<ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each brainTemplatesInCategory(category.slug) as template (template.slug)}
			<li>
				<TemplateCard {template} accentColor={category.accentColor} {onSelect} />
			</li>
		{/each}
	</ul>
</section>
