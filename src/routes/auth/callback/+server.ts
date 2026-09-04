import { redirect } from '@sveltejs/kit';
import { localDestinationOrDefault } from '$lib/server/auth/localDestination';
import type { RequestHandler } from './$types';

const signInPath = '/account/sign-in';

export const GET: RequestHandler = async ({ url, locals }) => {
	const code = url.searchParams.get('code');
	if (code === null) redirect(303, signInPath);
	const { error } = await locals.supabase.auth.exchangeCodeForSession(code);
	if (error) redirect(303, signInPath);
	redirect(303, localDestinationOrDefault(url.searchParams.get('next')));
};
