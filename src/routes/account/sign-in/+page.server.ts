import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (user !== null) redirect(303, '/workspace');
};

export const actions: Actions = {
	signIn: async ({ locals, request }) => {
		const credentials = await readCredentials(request);
		if (credentials === null) return missingCredentialsFailure();
		const { error } = await locals.supabase.auth.signInWithPassword(credentials);
		if (error) return authFailure(error.message);
		redirect(303, '/workspace');
	},
	signUp: async ({ locals, request }) => {
		const credentials = await readCredentials(request);
		if (credentials === null) return missingCredentialsFailure();
		const { data, error } = await locals.supabase.auth.signUp(credentials);
		if (error) return authFailure(error.message);
		if (data.session === null) {
			return { message: 'Check your inbox to confirm your email, then sign in.' };
		}
		redirect(303, '/workspace');
	}
};

async function readCredentials(
	request: Request
): Promise<{ email: string; password: string } | null> {
	const formData = await request.formData();
	const email = String(formData.get('email') ?? '').trim();
	const password = String(formData.get('password') ?? '');
	if (email === '' || password === '') return null;
	return { email, password };
}

function missingCredentialsFailure() {
	return fail(400, { message: 'Email and password are both required.' });
}

function authFailure(authErrorMessage: string) {
	const isReadable = authErrorMessage.trim().length > 2;
	if (isReadable) return fail(400, { message: authErrorMessage });
	return fail(400, { message: 'Sign-in failed — please check your details and try again.' });
}
