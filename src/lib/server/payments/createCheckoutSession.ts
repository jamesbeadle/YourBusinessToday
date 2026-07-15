import type Stripe from 'stripe';
import type { CreditPack } from '$lib/server/credits/getCreditPacks';

export async function createCheckoutSession(
	stripe: Stripe,
	creditPack: CreditPack,
	userId: string,
	origin: string
): Promise<string> {
	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		client_reference_id: userId,
		metadata: { packId: creditPack.id },
		line_items: [
			{
				quantity: 1,
				price_data: {
					currency: 'gbp',
					unit_amount: creditPack.pricePence,
					product_data: { name: `${creditPack.name} — ${creditPack.credits} credits` }
				}
			}
		],
		success_url: `${origin}/account/credits?checkout=success`,
		cancel_url: `${origin}/account/credits?checkout=cancelled`
	});
	if (session.url === null) throw new Error('checkout_session_missing_url');
	return session.url;
}
