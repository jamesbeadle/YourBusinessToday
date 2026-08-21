import { asBrainListing } from './getBrainListing';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { BrainListing } from '$lib/data/marketTypes';

export async function getPublishedListings(supabase: SupabaseClient): Promise<BrainListing[]> {
	const { data, error } = await supabase
		.from('brain_listings')
		.select(
			'id, brain_id, owner_id, owner_email, headline, description, edition_price_credits, ' +
				'subscription_price_credits, is_published, created_at'
		)
		.eq('is_published', true)
		.order('created_at', { ascending: false });
	if (error !== null) throw error;
	return (data ?? []).map(asBrainListing);
}
