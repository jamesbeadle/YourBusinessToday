import { error } from '@sveltejs/kit';
import { getBrainContexts } from '$lib/server/brain/getBrainContexts';
import { getBrainConversationThread } from '$lib/server/brain/getBrainConversation';
import { getBrainPageIndex } from '$lib/server/brain/getBrainPageIndex';
import { getBrainPageLinks } from '$lib/server/brain/getBrainPageLinks';
import { getDomainBrain, type DomainBrain } from '$lib/server/entities/getDomainBrain';
import { resolveBrainAccessRole } from '$lib/server/market/resolveBrainAccessRole';
import type { BrainAccessRole } from '$lib/data/marketTypes';
import type { KbBrainSummary } from '$lib/data/knowledge/knowledgeTypes';
import type {
	BrainContext,
	BrainConversationThread,
	BrainPageLink,
	BrainPageSummary
} from '$lib/data/brainTypes';
import type { SupabaseClient } from '@supabase/supabase-js';

export type ExpertiseBrainView = {
	kind: 'expertise';
	brain: DomainBrain;
	accessRole: BrainAccessRole;
	contexts: BrainContext[];
	pageIndex: BrainPageSummary[];
	pageLinks: BrainPageLink[];
	conversation: BrainConversationThread;
};

export async function loadExpertiseBrainView(
	supabase: SupabaseClient,
	storedBrain: KbBrainSummary,
	userId: string
): Promise<ExpertiseBrainView> {
	const brain = await requireDomainBrain(supabase, storedBrain);
	return {
		kind: 'expertise',
		brain,
		accessRole: await resolveBrainAccessRole(supabase, brain, userId),
		contexts: await getBrainContexts(supabase, brain.id),
		pageIndex: await getBrainPageIndex(supabase, brain.id),
		pageLinks: await getBrainPageLinks(supabase, brain.id),
		conversation: await getBrainConversationThread(supabase, brain.id, 'brain')
	};
}

export async function requireDomainBrain(
	supabase: SupabaseClient,
	storedBrain: KbBrainSummary
): Promise<DomainBrain> {
	const brain =
		storedBrain.domainBrainId === null
			? null
			: await getDomainBrain(supabase, storedBrain.domainBrainId);
	if (brain === null) error(404, 'That expertise brain has no model behind it');
	return brain;
}
