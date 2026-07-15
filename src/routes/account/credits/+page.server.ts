import { fail, redirect } from '@sveltejs/kit';
import { getCreditPacks } from '$lib/server/credits/getCreditPacks';
import { getProfileFlags } from '$lib/server/auth/getProfileFlags';
import { purchaseCreditPack } from '$lib/server/credits/purchaseCreditPack';
import { createCheckoutSession } from '$lib/server/payments/createCheckoutSession';
import { requireUser } from '$lib/server/auth/requireUser';
import { stripeClient } from '$lib/server/payments/stripeClient';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	await requireUser(locals);
	return {
		creditPacks: await getCreditPacks(locals.supabase),
		checkoutState: url.searchParams.get('checkout'),
		isCheckoutLive: stripeClient() !== null
	};
};

export const actions: Actions = {
	buy: async ({ locals, request, url }) => {
		const user = await requireUser(locals);
		const formData = await request.formData();
		const packId = String(formData.get('packId') ?? '');
		if (packId === '') return fail(400, { message: 'Choose a pack to buy.' });
		const profileFlags = await getProfileFlags(locals.supabase);
		if (profileFlags.isRestricted) {
			return fail(403, { message: 'This account is currently restricted from purchases.' });
		}
		const stripe = stripeClient();
		if (stripe === null) return placeholderPurchase(locals, packId);
		const creditPack = (await getCreditPacks(locals.supabase)).find((pack) => pack.id === packId);
		if (creditPack === undefined) return fail(400, { message: 'Choose a pack to buy.' });
		redirect(303, await createCheckoutSession(stripe, creditPack, user.id, url.origin));
	}
};

async function placeholderPurchase(locals: App.Locals, packId: string) {
	try {
		const creditBalance = await purchaseCreditPack(locals.supabase, packId);
		return { purchasedPackId: packId, creditBalance };
	} catch (purchaseError) {
		if (String(purchaseError).includes('account_restricted')) {
			return fail(403, { message: 'This account is currently restricted from purchases.' });
		}
		throw purchaseError;
	}
}
