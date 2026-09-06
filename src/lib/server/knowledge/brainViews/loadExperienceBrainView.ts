import { getBoundDomainBrainIds } from '../brainBindings';
import { getBrainItems } from '../getBrainItems';
import { brainHref } from '$lib/data/knowledge/knowledgeBaseRoutes';
import { schemaTypesFrom, type BoundSchemaType } from '$lib/data/knowledge/boundSchemaTypes';
import type { KbBrainItem, KbBrainSummary } from '$lib/data/knowledge/knowledgeTypes';
import type { SupabaseClient } from '@supabase/supabase-js';

export type ExperienceBrainView = {
	kind: 'experience';
	brain: KbBrainSummary;
	items: KbBrainItem[];
	domainBrains: KbBrainSummary[];
	boundDomainBrainIds: string[];
	schemaTypes: BoundSchemaType[];
	dddEditorHref: string | null;
};

export async function loadExperienceBrainView(
	supabase: SupabaseClient,
	brain: KbBrainSummary,
	knowledgeBaseBrains: KbBrainSummary[]
): Promise<ExperienceBrainView> {
	const domainBrains = knowledgeBaseBrains.filter((candidate) => candidate.category === 'domain');
	const boundDomainBrainIds =
		brain.category === 'instance' ? await getBoundDomainBrainIds(supabase, brain.id) : [];
	return {
		kind: 'experience',
		brain,
		items: await getBrainItems(supabase, brain.id),
		domainBrains,
		boundDomainBrainIds,
		schemaTypes: await boundSchemaTypesFor(supabase, boundDomainBrainIds),
		dddEditorHref: dddEditorHrefFor(brain, domainBrains)
	};
}

async function boundSchemaTypesFor(
	supabase: SupabaseClient,
	boundDomainBrainIds: string[]
): Promise<BoundSchemaType[]> {
	const itemLists = await Promise.all(
		boundDomainBrainIds.map((domainBrainId) => getBrainItems(supabase, domainBrainId))
	);
	return schemaTypesFrom(itemLists.flat());
}

function dddEditorHrefFor(brain: KbBrainSummary, domainBrains: KbBrainSummary[]): string | null {
	if (brain.domainBrainId === null) return null;
	const expertiseBrain = domainBrains.find(
		(candidate) => candidate.domainBrainId === brain.domainBrainId
	);
	if (expertiseBrain === undefined) return null;
	return brainHref(brain.knowledgeBaseId, expertiseBrain.id);
}
