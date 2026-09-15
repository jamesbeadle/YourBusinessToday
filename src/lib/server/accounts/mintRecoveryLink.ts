import { supabaseServiceClient } from '$lib/server/payments/supabaseServiceClient';

export type RecoveryLink = { accountId: string; actionLink: string };

export const setPasswordPath = '/auth/callback?next=/account/set-password';

/** A one-time link that signs the account holder in and takes them to set a password. */
export async function mintRecoveryLink(email: string, origin: string): Promise<RecoveryLink> {
	const service = supabaseServiceClient();
	const recovered = await service.auth.admin.generateLink({
		type: 'recovery',
		email,
		options: { redirectTo: `${origin}${setPasswordPath}` }
	});
	if (recovered.error !== null) throw recovered.error;
	return {
		accountId: recovered.data.user.id,
		actionLink: recovered.data.properties.action_link
	};
}
