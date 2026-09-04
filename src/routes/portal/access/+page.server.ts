import { fail } from '@sveltejs/kit';
import {
	createClientApiToken,
	getClientApiTokens,
	revokeClientApiToken
} from '$lib/server/clients/clientApiTokens';
import { requireClientContact } from '$lib/server/auth/requireClientContact';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const contact = await requireClientContact(locals);
	return {
		tokens: await getClientApiTokens(locals.supabase, contact.id),
		serverUrl: `${url.origin}/api/mcp`
	};
};

export const actions: Actions = {
	createToken: async ({ locals, request }) => {
		const contact = await requireClientContact(locals);
		const name = String((await request.formData()).get('name') ?? '').trim();
		if (name === '') return fail(400, { message: 'Give the token a name you will recognise.' });
		return { mintedToken: await createClientApiToken(locals.supabase, contact.id, name) };
	},
	revokeToken: async ({ locals, request }) => {
		await requireClientContact(locals);
		const tokenId = String((await request.formData()).get('tokenId') ?? '');
		if (tokenId === '') return fail(400, { message: 'A token is required.' });
		await revokeClientApiToken(locals.supabase, tokenId);
		return { message: 'Token revoked.' };
	}
};
