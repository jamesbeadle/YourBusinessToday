<script lang="ts">
	import BrainEditor from './BrainEditor.svelte';
	import BrainQueryPanel from './BrainQueryPanel.svelte';
	import KbInterviewPanel from './KbInterviewPanel.svelte';
	import KindBrainSettingsPanel from './KindBrainSettingsPanel.svelte';
	import { findBrainType } from '$lib/data/knowledge/brainTypeCatalog';
	import { kindForCategory } from '$lib/data/knowledge/knowledgeKinds';
	import { kindInterviewIntros } from './interviewRequest';
	import type { BoundSchemaType } from '$lib/data/knowledge/boundSchemaTypes';
	import type { KbBrainItem, KbBrainSummary } from '$lib/data/knowledge/knowledgeTypes';
	import type { SectionKey } from '../brain/dashboard/railIcons';

	let {
		section,
		knowledgeBaseId,
		brain,
		items,
		domainBrains,
		boundDomainBrainIds,
		schemaTypes,
		dddEditorHref,
		isOwner
	}: {
		section: SectionKey;
		knowledgeBaseId: string;
		brain: KbBrainSummary;
		items: KbBrainItem[];
		domainBrains: KbBrainSummary[];
		boundDomainBrainIds: string[];
		schemaTypes: BoundSchemaType[];
		dddEditorHref: string | null;
		isOwner: boolean;
	} = $props();

	const focusKind = $derived(kindForCategory(brain.category).kind);
	const editor = $derived(findBrainType(brain.brainType)?.editor ?? 'notes');
</script>

{#if section === 'interview'}
	<div class="min-h-0 flex-1 overflow-y-auto p-4">
		<KbInterviewPanel {knowledgeBaseId} {focusKind} intro={kindInterviewIntros[focusKind]} />
	</div>
{:else if section === 'terminal'}
	<BrainQueryPanel brainId={brain.id} />
{:else if section === 'contents'}
	<div class="min-h-0 flex-1 overflow-y-auto p-4">
		<BrainEditor {editor} {items} {schemaTypes} {dddEditorHref} />
	</div>
{:else}
	<KindBrainSettingsPanel {brain} {domainBrains} {boundDomainBrainIds} {isOwner} />
{/if}
