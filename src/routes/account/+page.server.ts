import { fail, redirect } from '@sveltejs/kit';
import { getDisplayName } from '$lib/server/auth/getDisplayName';
import { getPurchaseHistory } from '$lib/server/credits/getPurchaseHistory';
import { getTradeTalkEarnings } from '$lib/server/credits/getTradeTalkEarnings';
import { requireUser } from '$lib/server/auth/requireUser';
import { saveDisplayName } from '$lib/server/auth/saveDisplayName';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	await requireUser(locals);
	return {
		purchases: await getPurchaseHistory(locals.supabase),
		displayName: await getDisplayName(locals.supabase),
		tradeTalkEarnings: await getTradeTalkEarnings(locals.supabase)
	};
};

export const actions: Actions = {
	signOut: async ({ locals }) => {
		await locals.supabase.auth.signOut();
		redirect(303, '/');
	},
	saveDisplayName: async ({ locals, request }) => {
		await requireUser(locals);
		const formData = await request.formData();
		const displayName = String(formData.get('displayName') ?? '').trim();
		if (displayName.length > 60) {
			return fail(400, { message: 'Display names are 60 characters at most.' });
		}
		await saveDisplayName(locals.supabase, displayName);
		return { message: 'Profile saved.' };
	}
};
