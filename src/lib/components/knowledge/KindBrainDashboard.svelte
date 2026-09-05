<script lang="ts">
	import ItemBrainCanvas from './ItemBrainCanvas.svelte';
	import RegionBrain from '../brain/RegionBrain.svelte';
	import KindBrainPanelContent from './KindBrainPanelContent.svelte';
	import SectionPanel from '../brain/dashboard/SectionPanel.svelte';
	import SectionRail from '../brain/dashboard/SectionRail.svelte';
	import { kindMemberSections, kindOwnerSections, type SectionKey } from '../brain/dashboard/railIcons';
	import { kindForCategory } from '$lib/data/knowledge/knowledgeKinds';
	import { isWideScreen } from '$lib/client/isWideScreen';
	import { onMount } from 'svelte';
	import type { BoundSchemaType } from '$lib/data/knowledge/boundSchemaTypes';
	import type { KbBrainItem, KbBrainSummary } from '$lib/data/knowledge/knowledgeTypes';
	import type { KnowledgeBase } from '$lib/server/knowledge/getKnowledgeBase';

	let {
		knowledgeBase,
		brain,
		items,
		domainBrains,
		boundDomainBrainIds,
		schemaTypes,
		dddEditorHref,
		isOwner
	}: {
		knowledgeBase: KnowledgeBase;
		brain: KbBrainSummary;
		items: KbBrainItem[];
		domainBrains: KbBrainSummary[];
		boundDomainBrainIds: string[];
		schemaTypes: BoundSchemaType[];
		dddEditorHref: string | null;
		isOwner: boolean;
	} = $props();

	const kind = $derived(kindForCategory(brain.category));
	const sections = $derived(isOwner ? kindOwnerSections : kindMemberSections);

	let activeSection = $state<SectionKey | null>(null);

	onMount(() => {
		if (isWideScreen()) activeSection = 'interview';
	});

	function toggleSection(section: SectionKey): void {
		activeSection = activeSection === section ? null : section;
	}
</script>

<div class="flex h-[calc(100dvh-3.5rem)] flex-col overflow-hidden bg-night lg:flex-row">
	<div class="order-2 lg:order-1 lg:contents">
		<SectionRail {sections} {activeSection} onSelect={toggleSection} />
	</div>
	<div class="relative order-1 flex min-h-0 min-w-0 flex-1 lg:order-2">
		{#if activeSection !== null}
			<SectionPanel section={activeSection} onClose={() => (activeSection = null)}>
				<KindBrainPanelContent
					section={activeSection}
					knowledgeBaseId={knowledgeBase.id}
					{brain}
					{items}
					{domainBrains}
					{boundDomainBrainIds}
					{schemaTypes}
					{dddEditorHref}
					{isOwner}
				/>
			</SectionPanel>
		{/if}
		<div class="relative min-w-0 flex-1">
			{#if kind.kind === 'experience'}
				<RegionBrain {items} seed={brain.id} />
			{:else}
				<ItemBrainCanvas seed={brain.id} accent={kind.accent} itemCount={items.length} />
			{/if}
			<div class="pointer-events-none absolute top-4 left-4 z-10 flex flex-col gap-0.5">
				<h1 class="font-display text-lg font-medium text-chalk">{brain.name}</h1>
				<p
					class="font-display text-[10px] tracking-widest uppercase"
					style={`color: ${kind.accent}`}
				>
					{kind.label} brain
				</p>
			</div>
			<div class="absolute inset-x-0 bottom-0 z-10 flex items-center px-4 py-2">
				<a
					href={`/knowledge-base/${knowledgeBase.id}`}
					class="font-display text-xs text-chalk/50 transition hover:text-chalk"
				>
					← {knowledgeBase.name}
				</a>
			</div>
		</div>
	</div>
</div>
