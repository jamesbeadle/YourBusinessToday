import { redirect } from '@sveltejs/kit';
import { beginGoogleSignIn } from '$lib/server/auth/beginGoogleSignIn';
import { beginMicrosoftSignIn } from '$lib/server/auth/beginMicrosoftSignIn';
import type { Actions, PageServerLoad } from './$types';

const destinationAfterAuth = '/knowledge-base';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { user } = await locals.safeGetSession();
	if (user !== null) redirect(303, destinationAfterAuth);
	return {
		isInvited: url.searchParams.get('invited') === '1',
		invitedBy: url.searchParams.get('by') ?? ''
	};
};

export const actions: Actions = {
	signInWithGoogle: async ({ locals, url }) => {
		redirect(303, await beginGoogleSignIn(locals.supabase, url.origin));
	},
	signInWithMicrosoft: async ({ locals, url }) => {
		redirect(303, await beginMicrosoftSignIn(locals.supabase, url.origin));
	}
};
