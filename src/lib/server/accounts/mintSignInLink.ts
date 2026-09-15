import { supabaseServiceClient } from '$lib/server/payments/supabaseServiceClient';

export type SignInLink = { accountId: string; actionLink: string };

const setPasswordPath = '/auth/callback?next=/account/set-password';

/**
 * An address we have never seen gets an invite link, which creates the
 * account; one that already holds an account cannot be invited twice, so it
 * gets a recovery link to the same set-password page.
 */
export async function mintSignInLink(email: string, origin: string): Promise<SignInLink> {
	const service = supabaseServiceClient();
	const redirectTo = `${origin}${setPasswordPath}`;
	const invited = await service.auth.admin.generateLink({
		type: 'invite',
		email,
		options: { redirectTo }
	});
	if (invited.error === null) return readSignInLink(invited.data);
	const recovered = await service.auth.admin.generateLink({
		type: 'recovery',
		email,
		options: { redirectTo }
	});
	if (recovered.error !== null) throw recovered.error;
	return readSignInLink(recovered.data);
}

function readSignInLink(data: Record<string, any>): SignInLink {
	return {
		accountId: data.user.id as string,
		actionLink: data.properties.action_link as string
	};
}
