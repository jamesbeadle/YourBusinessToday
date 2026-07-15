import type Stripe from 'stripe';
import { supabaseServiceClient } from './supabaseServiceClient';

export async function creditPurchaseFromCheckout(
	session: Stripe.Checkout.Session
): Promise<void> {
	const userId = session.client_reference_id;
	const packId = session.metadata?.packId;
	if (!userId || !packId) throw new Error('checkout_session_missing_purchase_details');
	const supabase = supabaseServiceClient();
	const { error } = await supabase.rpc('complete_stripe_purchase', {
		user_identifier: userId,
		pack_identifier: packId,
		checkout_session_identifier: session.id
	});
	if (error) throw error;
}
