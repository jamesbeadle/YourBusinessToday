import type { SupabaseClient } from '@supabase/supabase-js';
import type { BrainSubscription, PurchasedEdition, SubscriptionStatus } from '$lib/data/marketTypes';

export async function getPurchasedEditions(
	supabase: SupabaseClient,
	buyerId: string
): Promise<PurchasedEdition[]> {
	const { data, error } = await supabase
		.from('brain_purchases')
		.select(
			'id, price_credits, purchased_at, brain_listings (headline), ' +
				'brain_editions (name, version, snapshot_brain_id, domain_brains (id, entity_id))'
		)
		.eq('buyer_id', buyerId)
		.eq('kind', 'edition')
		.order('purchased_at', { ascending: false });
	if (error !== null) throw error;
	return (data ?? []).map((row) => {
		const edition = one(row.brain_editions);
		const snapshotBrain = one(edition?.domain_brains);
		return {
			purchaseId: row.id,
			headline: one(row.brain_listings)?.headline ?? '',
			editionName: edition?.name ?? '',
			editionVersion: edition?.version ?? 0,
			priceCredits: row.price_credits,
			purchasedAt: row.purchased_at,
			brainId: snapshotBrain?.id ?? '',
			entityId: snapshotBrain?.entity_id ?? ''
		};
	});
}

export async function getBrainSubscriptions(
	supabase: SupabaseClient,
	buyerId: string
): Promise<BrainSubscription[]> {
	const { data, error } = await supabase
		.from('brain_purchases')
		.select(
			'id, listing_id, price_credits, current_period_end, status, ' +
				'brain_listings (headline, brain_id, domain_brains (entity_id))'
		)
		.eq('buyer_id', buyerId)
		.eq('kind', 'subscription')
		.order('current_period_end', { ascending: false });
	if (error !== null) throw error;
	return (data ?? []).map((row) => {
		const listing = one(row.brain_listings);
		return {
			purchaseId: row.id,
			listingId: row.listing_id,
			headline: listing?.headline ?? '',
			priceCredits: row.price_credits,
			currentPeriodEnd: row.current_period_end,
			status: row.status as SubscriptionStatus,
			brainId: listing?.brain_id ?? '',
			entityId: one(listing?.domain_brains)?.entity_id ?? ''
		};
	});
}

function one<Row>(nested: Row | Row[] | null | undefined): Row | undefined {
	if (nested === null || nested === undefined) return undefined;
	if (Array.isArray(nested)) return nested[0];
	return nested;
}
