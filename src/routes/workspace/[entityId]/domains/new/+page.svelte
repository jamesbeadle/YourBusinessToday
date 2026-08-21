<script lang="ts">
	import TemplateCategorySection from '$lib/components/workspace/templates/TemplateCategorySection.svelte';
	import TemplateCreateModal from '$lib/components/workspace/templates/TemplateCreateModal.svelte';
	import {
		brainTemplateCategories,
		scratchBrainTemplate,
		type BrainTemplate
	} from '$lib/data/brainTemplates';

	let { data } = $props();

	let selectedTemplate = $state<BrainTemplate>(scratchBrainTemplate);
	let isCreateModalOpen = $state(false);

	function openTemplate(template: BrainTemplate) {
		selectedTemplate = template;
		isCreateModalOpen = true;
	}
</script>

<svelte:head>
	<title>New domain brain — {data.entity.name} — Your Business Today</title>
</svelte:head>

<div class="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
	<div class="flex flex-col gap-6">
		<a
			href={`/workspace/${data.entity.id}`}
			class="font-display text-sm text-chalk/60 transition hover:text-chalk"
		>
			← Back to {data.entity.name}
		</a>
		<header class="flex flex-wrap items-end justify-between gap-4">
			<div class="flex max-w-2xl flex-col gap-2">
				<p class="font-display text-sm tracking-widest text-signal uppercase">New domain brain</p>
				<h1 class="font-display text-3xl font-medium">What should it know?</h1>
				<p class="text-chalk/70">
					Every template is a ready-made goal that tunes the brain for its domain. Pick one, feed
					it your documents, then ask it anything — or write your own goal from scratch.
				</p>
			</div>
			<button
				type="button"
				onclick={() => openTemplate(scratchBrainTemplate)}
				class="rounded-full border border-signal/60 px-6 py-2.5 font-display text-sm text-signal
					transition hover:bg-signal hover:text-night"
			>
				Start from scratch
			</button>
		</header>
	</div>
	{#each brainTemplateCategories as category (category.slug)}
		<TemplateCategorySection {category} onSelect={openTemplate} />
	{/each}
	<button
		type="button"
		onclick={() => openTemplate(scratchBrainTemplate)}
		class="group flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2
			border-dashed border-hairline p-6 text-left transition hover:border-signal/60"
	>
		<span class="flex flex-col gap-1">
			<span class="font-display text-base font-medium text-chalk">Building something else?</span>
			<span class="text-sm text-chalk/60">
				Start from scratch — name the domain, state its goal, and the brain will follow it.
			</span>
		</span>
		<span class="font-display text-sm text-signal transition group-hover:translate-x-0.5">
			Start from scratch →
		</span>
	</button>
</div>

<TemplateCreateModal
	entityId={data.entity.id}
	template={selectedTemplate}
	bind:isOpen={isCreateModalOpen}
/>
