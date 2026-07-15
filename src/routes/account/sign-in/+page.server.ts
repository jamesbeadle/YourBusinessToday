import { fail, redirect } from '@sveltejs/kit';
import { beginOAuthSignIn } from '$lib/server/auth/beginOAuthSignIn';
import { readCredentials } from '$lib/server/auth/readCredentials';
import type { Actions, PageServerLoad } from './$types';

const destinationAfterAuth = '/workspace';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (user !== null) redirect(303, destinationAfterAuth);
};

export const actions: Actions = {
	signIn: async ({ locals, request }) => {
		const credentials = await readCredentials(request);
		if (credentials === null) return missingCredentialsFailure();
		const { error } = await locals.supabase.auth.signInWithPassword(credentials);
		if (error === null) redirect(303, destinationAfterAuth);
		if (isUnverifiedEmailError(error.message)) {
			return fail<SignInFailureData>(400, {
				message: 'Your email is not verified yet — check your inbox for the link.',
				unverifiedEmail: credentials.email
			});
		}
		return authFailure(error.message);
	},
	signUp: async ({ locals, request, url }) => {
		const credentials = await readCredentials(request);
		if (credentials === null) return missingCredentialsFailure();
		const { data, error } = await locals.supabase.auth.signUp({
			...credentials,
			options: { emailRedirectTo: verificationRedirectUrl(url.origin) }
		});
		if (error) return authFailure(error.message);
		if (data.session === null) {
			return {
				message: 'Almost there — click the verification link we just emailed you.',
				isSuccess: true
			};
		}
		redirect(303, destinationAfterAuth);
	},
	resendVerification: async ({ locals, request, url }) => {
		const formData = await request.formData();
		const email = String(formData.get('email') ?? '').trim();
		if (email === '') return missingCredentialsFailure();
		const { error } = await locals.supabase.auth.resend({
			type: 'signup',
			email,
			options: { emailRedirectTo: verificationRedirectUrl(url.origin) }
		});
		if (error) return authFailure(error.message);
		return { message: `Verification email sent to ${email}.`, isSuccess: true };
	},
	signInWithGoogle: async ({ locals, url }) => {
		redirect(303, await beginOAuthSignIn(locals.supabase, 'google', url.origin));
	},
	signInWithMicrosoft: async ({ locals, url }) => {
		redirect(303, await beginOAuthSignIn(locals.supabase, 'azure', url.origin));
	}
};

type SignInFailureData = { message: string; unverifiedEmail?: string };

function verificationRedirectUrl(origin: string): string {
	return `${origin}/auth/callback?next=${destinationAfterAuth}`;
}

function isUnverifiedEmailError(authErrorMessage: string): boolean {
	return authErrorMessage.toLowerCase().includes('not confirmed');
}

function missingCredentialsFailure() {
	return fail<SignInFailureData>(400, { message: 'Email and password are both required.' });
}

function authFailure(authErrorMessage: string) {
	const isReadable = authErrorMessage.trim().length > 2;
	const message = isReadable
		? authErrorMessage
		: 'Sign-in failed — please check your details and try again.';
	return fail<SignInFailureData>(400, { message });
}
