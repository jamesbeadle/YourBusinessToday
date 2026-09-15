import { findAccountByEmail } from '$lib/server/accounts/findAccountByEmail';
import { mintRecoveryLink } from '$lib/server/accounts/mintRecoveryLink';
import {
	passwordResetEmailSubject,
	renderPasswordResetEmail
} from '$lib/server/email/passwordResetEmail';
import { sendTransactionalEmail } from '$lib/server/email/sendTransactionalEmail';
import { supabaseServiceClient } from '$lib/server/payments/supabaseServiceClient';
import type { EmailDelivery } from '$lib/data/emailDelivery';

export type PasswordResetOutcome = 'no_account' | EmailDelivery;

/** Emails the account holder a one-time link to the set-password page. */
export async function sendUserPasswordReset(
	targetEmail: string,
	origin: string
): Promise<PasswordResetOutcome> {
	const account = await findAccountByEmail(supabaseServiceClient(), targetEmail);
	if (account === null) return 'no_account';
	const recoveryLink = await mintRecoveryLink(account.email, origin);
	return sendTransactionalEmail({
		to: account.email,
		subject: passwordResetEmailSubject,
		html: renderPasswordResetEmail(recoveryLink.actionLink)
	});
}
