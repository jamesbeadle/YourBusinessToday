import { getBrainApiTokens } from '$lib/server/brainApi/brainApiTokens';
import { getBrainEvents } from '$lib/server/brain/getBrainEvents';
import { getBrainMarketState } from '$lib/server/market/getBrainMarketState';
import { getBrainSources } from '$lib/server/brain/getBrainSources';
import { getDomainBrain, type DomainBrain } from '$lib/server/entities/getDomainBrain';
import { getHiveBrainStatus } from '$lib/server/hive/getHiveBrainStatus';
import { getPendingProposals } from '$lib/server/sharing/getPendingProposals';
import type { BrainChangeProposal } from '$lib/data/sharingTypes';
import type { BrainEdition, BrainListing, ListingSales } from '$lib/data/marketTypes';
import type { BrainApiToken } from '$lib/data/brainApiTypes';
import type { BrainEvent, BrainSource } from '$lib/data/brainTypes';
import type { HiveBrainStatus } from '$lib/data/hiveTypes';
import type { PrimaryExpertiseBrain } from './interviewContext';
import type { SupabaseClient } from '@supabase/supabase-js';

export type KbWorkbenchData = {
	primaryBrain: DomainBrain | null;
	sources: BrainSource[];
	events: BrainEvent[];
	proposals: BrainChangeProposal[];
	listing: BrainListing | null;
	editions: BrainEdition[];
	sales: ListingSales | null;
	hive: HiveBrainStatus | null;
	apiTokens: BrainApiToken[];
};

const emptyWorkbench: KbWorkbenchData = {
	primaryBrain: null,
	sources: [],
	events: [],
	proposals: [],
	listing: null,
	editions: [],
	sales: null,
	hive: null,
	apiTokens: []
};

export async function loadKbWorkbenchData(
	supabase: SupabaseClient,
	primary: PrimaryExpertiseBrain | null,
	isOwner: boolean
): Promise<KbWorkbenchData> {
	if (primary === null) return emptyWorkbench;
	const primaryBrain = await getDomainBrain(supabase, primary.domainBrainId);
	if (primaryBrain === null) return emptyWorkbench;
	const marketState = isOwner
		? await getBrainMarketState(supabase, primaryBrain.id)
		: { listing: null, editions: [], sales: null };
	return {
		primaryBrain,
		sources: await getBrainSources(supabase, primaryBrain.id),
		events: await getBrainEvents(supabase, primaryBrain.id),
		proposals: isOwner ? await getPendingProposals(supabase, primaryBrain.id) : [],
		hive: isOwner ? await getHiveBrainStatus(supabase, primaryBrain.id) : null,
		apiTokens: isOwner ? await getBrainApiTokens(supabase, primaryBrain.id) : [],
		...marketState
	};
}
