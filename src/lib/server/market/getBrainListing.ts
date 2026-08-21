import type { SupabaseClient } from '@supabase/supabase-js';
import type { BrainListing } from '$lib/data/marketTypes';

const listingColumns =
	'id, brain_id, owner_id, owner_name, headline, description, edition_price_credits, ' +
	'subscription_price_credits, is_published, created_at';

export async function getListingForBrain(
	supabase: SupabaseClient,
	brainId: string
): Promise<BrainListing | null> {
	const { data, error } = await supabase
		.from('brain_listings')
		.select(listingColumns)
		.eq('brain_id', brainId)
		.maybeSingle();
	if (error !== null) throw error;
	if (data === null) return null;
	return asBrainListing(data);
}

export async function getPublishedListing(
	supabase: SupabaseClient,
	listingId: string
): Promise<BrainListing | null> {
	const { data, error } = await supabase
		.from('brain_listings')
		.select(listingColumns)
		.eq('id', listingId)
		.maybeSingle();
	if (error !== null) throw error;
	if (data === null) return null;
	return asBrainListing(data);
}

export function asBrainListing(row: Record<string, unknown>): BrainListing {
	return {
		id: String(row.id),
		brainId: String(row.brain_id),
		ownerId: String(row.owner_id),
		ownerName: String(row.owner_name),
		headline: String(row.headline),
		description: String(row.description),
		editionPriceCredits: row.edition_price_credits as number | null,
		subscriptionPriceCredits: row.subscription_price_credits as number | null,
		isPublished: Boolean(row.is_published),
		createdAt: String(row.created_at)
	};
}
