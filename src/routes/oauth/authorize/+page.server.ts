import { error, redirect } from '@sveltejs/kit';
import {
	issueAuthorizationCode,
	redirectBackWithCode,
	redirectBackWithRefusal
} from '$lib/server/oauth/issueAuthorizationCode';
import { readAuthorizationRequest } from '$lib/server/oauth/authorizationRequest';
import { resolveAccountStanding } from '$lib/server/mcp/resolveAccountStanding';
import { supabaseServiceClient } from '$lib/server/payments/supabaseServiceClient';
import type { Actions, PageServerLoad } from './$types';

const badRequest = 400;
const seeOther = 303;

export const load: PageServerLoad = async ({ locals, url }) => {
	const authorizationRequest = await readAuthorizationRequest(url.searchParams);
	if (authorizationRequest === null) {
		error(badRequest, 'That connection request is not valid. Start again from the app you are connecting.');
	}
	const { user } = await locals.safeGetSession();
	if (user === null) redirect(seeOther, signInThenReturn(url));
	const standing = await resolveAccountStanding(supabaseServiceClient(), user.id);
	return {
		clientName: authorizationRequest.clientName,
		email: standing.email,
		role: standing.role,
		isAdmin: standing.isAdmin
	};
};

export const actions: Actions = {
	approve: async ({ locals, url }) => {
		const authorizationRequest = await readAuthorizationRequest(url.searchParams);
		if (authorizationRequest === null) error(badRequest, 'That connection request is not valid.');
		const { user } = await locals.safeGetSession();
		if (user === null) redirect(seeOther, signInThenReturn(url));
		const code = await issueAuthorizationCode(authorizationRequest, user.id);
		redirect(seeOther, redirectBackWithCode(authorizationRequest, code));
	},
	refuse: async ({ url }) => {
		const authorizationRequest = await readAuthorizationRequest(url.searchParams);
		if (authorizationRequest === null) error(badRequest, 'That connection request is not valid.');
		redirect(seeOther, redirectBackWithRefusal(authorizationRequest));
	}
};

function signInThenReturn(url: URL): string {
	return `/account/sign-in?next=${encodeURIComponent(`${url.pathname}${url.search}`)}`;
}
