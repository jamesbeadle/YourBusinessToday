import { createKbBrain } from '$lib/server/knowledge/createKbBrain';
import type { SupabaseClient } from '@supabase/supabase-js';

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

export type HarvestBrainType = keyof typeof harvestBrainBlueprints;

export async function findOrCreateHarvestBrain(
	supabase: SupabaseClient,
	knowledgeBaseId: string,
	brainType: HarvestBrainType
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
