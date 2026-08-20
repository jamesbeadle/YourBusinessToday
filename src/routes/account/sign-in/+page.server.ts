import { redirect } from '@sveltejs/kit';
import { beginGoogleSignIn } from '$lib/server/auth/beginGoogleSignIn';
import type { Actions, PageServerLoad } from './$types';

const destinationAfterAuth = '/workspace';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (user !== null) redirect(303, destinationAfterAuth);
};

export const actions: Actions = {
	signInWithGoogle: async ({ locals, url }) => {
		redirect(303, await beginGoogleSignIn(locals.supabase, url.origin));
	}
};
