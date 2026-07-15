import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const signInPath = '/account/sign-in';
const defaultDestination = '/workspace';

export const GET: RequestHandler = async ({ url, locals }) => {
	const code = url.searchParams.get('code');
	if (code === null) redirect(303, signInPath);
	const { error } = await locals.supabase.auth.exchangeCodeForSession(code);
	if (error) redirect(303, signInPath);
	redirect(303, safeDestination(url.searchParams.get('next')));
};

function safeDestination(next: string | null): string {
	const isLocalPath = next !== null && next.startsWith('/') && !next.startsWith('//');
	if (isLocalPath) return next;
	return defaultDestination;
}
