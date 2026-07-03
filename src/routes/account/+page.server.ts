import { redirect } from '@sveltejs/kit';
import { getPurchaseHistory } from '$lib/server/credits/getPurchaseHistory';
import { requireUser } from '$lib/server/auth/requireUser';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	await requireUser(locals);
	return { purchases: await getPurchaseHistory(locals.supabase) };
};

export const actions: Actions = {
	signOut: async ({ locals }) => {
		await locals.supabase.auth.signOut();
		redirect(303, '/');
	}
};
