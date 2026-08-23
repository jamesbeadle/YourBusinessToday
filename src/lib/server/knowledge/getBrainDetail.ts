import type { SupabaseClient } from '@supabase/supabase-js';
import { getBoundDomainBrainIds } from './brainBindings';
import { getBrainItems } from './getBrainItems';
import { getKbBrain } from './getKbBrain';
import { getKbBrains } from './getKbBrains';
import { getKnowledgeBase, type KnowledgeBase } from './getKnowledgeBase';
import { getDomainBrain } from '$lib/server/entities/getDomainBrain';
import { schemaTypesFrom, type BoundSchemaType } from '$lib/data/knowledge/boundSchemaTypes';
import type { KbBrainItem, KbBrainSummary } from '$lib/data/knowledge/knowledgeTypes';

export type BrainDetail = {
	knowledgeBase: KnowledgeBase;
	brain: KbBrainSummary;
	items: KbBrainItem[];
	domainBrains: KbBrainSummary[];
	boundDomainBrainIds: string[];
	schemaTypes: BoundSchemaType[];
	dddEditorHref: string | null;
};

export async function getBrainDetail(
	supabase: SupabaseClient,
	knowledgeBaseId: string,
	brainId: string
): Promise<BrainDetail | null> {
	const [knowledgeBase, brain] = await Promise.all([
		getKnowledgeBase(supabase, knowledgeBaseId),
		getKbBrain(supabase, brainId)
	]);
	if (knowledgeBase === null || brain === null) return null;
	if (brain.knowledgeBaseId !== knowledgeBase.id) return null;
	const [items, allBrains, boundDomainBrainIds] = await Promise.all([
		getBrainItems(supabase, brain.id),
		getKbBrains(supabase, knowledgeBase.id),
		brain.category === 'instance' ? getBoundDomainBrainIds(supabase, brain.id) : []
	]);
	return {
		knowledgeBase,
		brain,
		items,
		domainBrains: allBrains.filter((candidate) => candidate.category === 'domain'),
		boundDomainBrainIds,
		schemaTypes: await boundSchemaTypesFor(supabase, boundDomainBrainIds),
		dddEditorHref: await dddEditorHrefFor(supabase, brain)
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

async function dddEditorHrefFor(
	supabase: SupabaseClient,
	brain: KbBrainSummary
): Promise<string | null> {
	if (brain.domainBrainId === null) return null;
	const domainBrain = await getDomainBrain(supabase, brain.domainBrainId);
	if (domainBrain === null) return null;
	return `/workspace/${domainBrain.entityId}/domains/${domainBrain.id}`;
}
