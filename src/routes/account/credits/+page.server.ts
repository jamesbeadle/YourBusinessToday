import { fail } from '@sveltejs/kit';
import { getCreditPacks } from '$lib/server/credits/getCreditPacks';
import { purchaseCreditPack } from '$lib/server/credits/purchaseCreditPack';
import { requireUser } from '$lib/server/auth/requireUser';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	await requireUser(locals);
	return { creditPacks: await getCreditPacks(locals.supabase) };
};

export const actions: Actions = {
	buy: async ({ locals, request }) => {
		await requireUser(locals);
		const formData = await request.formData();
		const packId = String(formData.get('packId') ?? '');
		if (packId === '') return fail(400, { message: 'Choose a pack to buy.' });
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
};
