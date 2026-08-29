import { createBrainItem } from '$lib/server/knowledge/createBrainItem';
import { createKbBrain } from '$lib/server/knowledge/createKbBrain';
import type { HarvestedKnowledge } from './parseHarvest';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function fileHarvestedKnowledge(
	supabase: SupabaseClient,
	entityId: string,
	harvest: HarvestedKnowledge
): Promise<void> {
	if (harvest.expertiseFacts.length === 0 && harvest.experienceEvents.length === 0) return;
	const knowledgeBaseIds = await linkedKnowledgeBaseIds(supabase, entityId);
	if (knowledgeBaseIds.length === 0) return;
	const knowledgeBaseId = knowledgeBaseIds[0];
	if (harvest.expertiseFacts.length > 0) {
		const factsBrainId = await findOrCreateBrain(supabase, knowledgeBaseId, 'rules');
		await fileFacts(supabase, factsBrainId, harvest.expertiseFacts);
	}
	if (harvest.experienceEvents.length > 0) {
		const eventsBrainId = await findOrCreateBrain(supabase, knowledgeBaseId, 'episodic_log');
		await fileEvents(supabase, eventsBrainId, harvest.experienceEvents);
	}
}

const harvestBrainBlueprints = {
	rules: {
		category: 'domain',
		name: 'Rules & Standards',
		description: 'Trade knowledge harvested from your interview conversations.'
	},
	episodic_log: {
		category: 'instance',
		name: 'Interview Log',
		description: 'Events harvested from your interview conversations.'
	}
} as const;

async function findOrCreateBrain(
	supabase: SupabaseClient,
	knowledgeBaseId: string,
	brainType: keyof typeof harvestBrainBlueprints
): Promise<string> {
	const { data, error } = await supabase
		.from('kb_brains')
		.select('id')
		.eq('knowledge_base_id', knowledgeBaseId)
		.eq('brain_type', brainType)
		.order('created_at')
		.limit(1);
	if (error !== null) throw error;
	if (data !== null && data.length > 0) return data[0].id;
	const blueprint = harvestBrainBlueprints[brainType];
	return createKbBrain(supabase, {
		knowledgeBaseId,
		category: blueprint.category,
		brainType,
		name: blueprint.name,
		description: blueprint.description
	});
}

async function linkedKnowledgeBaseIds(
	supabase: SupabaseClient,
	entityId: string
): Promise<string[]> {
	const { data, error } = await supabase
		.from('kb_brains')
		.select('knowledge_base_id, domain_brains!inner(entity_id)')
		.eq('domain_brains.entity_id', entityId);
	if (error !== null) throw error;
	const knowledgeBaseIds = (data ?? []).map((row) => row.knowledge_base_id as string);
	return [...new Set(knowledgeBaseIds)];
}

async function fileFacts(
	supabase: SupabaseClient,
	factsBrainId: string,
	facts: string[]
): Promise<void> {
	for (const fact of facts) {
		await createBrainItem(supabase, { brainId: factsBrainId, itemKind: 'rule', title: fact });
	}
}

async function fileEvents(
	supabase: SupabaseClient,
	eventsBrainId: string,
	events: HarvestedKnowledge['experienceEvents']
): Promise<void> {
	for (const event of events) {
		await createBrainItem(supabase, {
			brainId: eventsBrainId,
			itemKind: 'episode',
			title: event.title,
			body: event.note,
			occurredAt: event.occurredAt ?? new Date().toISOString()
		});
	}
}
