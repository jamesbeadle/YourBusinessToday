import { clientInviteEmailSubject, renderClientInviteEmail } from '$lib/server/email/clientInviteEmail';
import { recordClientEvent } from './recordClientEvent';
import { sendTransactionalEmail } from '$lib/server/email/sendTransactionalEmail';
import { supabaseServiceClient } from '$lib/server/payments/supabaseServiceClient';
import type { ClientContact } from './clientContactRecord';
import type { SupabaseClient } from '@supabase/supabase-js';

export type InviteOutcome = 'invited' | 'already_invited';

const setPasswordPath = '/auth/callback?next=/account/set-password';

export async function inviteClientContact(
	supabase: SupabaseClient,
	contact: ClientContact,
	origin: string,
	actorAccountId: string
): Promise<InviteOutcome> {
	if (contact.accountId !== null) return 'already_invited';
	const invitation = await mintInvitation(contact.email, `${origin}${setPasswordPath}`);
	await linkContactToAccount(supabase, contact.id, invitation.accountId);
	await deliverInvitation(contact, invitation.actionLink);
	await recordClientEvent(
		supabase,
		contact.clientId,
		'contact_invited',
		{ email: contact.email },
		actorAccountId
	);
	return 'invited';
}

type Invitation = { accountId: string; actionLink: string };

// An address we have never seen takes the invite link; one that already has an
// account (a colleague who signed in with Google, say) cannot be invited twice,
// so it takes a recovery link to the same set-password page.
async function mintInvitation(email: string, redirectTo: string): Promise<Invitation> {
	const service = supabaseServiceClient();
	const invited = await service.auth.admin.generateLink({
		type: 'invite',
		email,
		options: { redirectTo }
	});
	if (invited.error === null) return readInvitation(invited.data);
	const recovered = await service.auth.admin.generateLink({
		type: 'recovery',
		email,
		options: { redirectTo }
	});
	if (recovered.error !== null) throw recovered.error;
	return readInvitation(recovered.data);
}

function readInvitation(data: Record<string, any>): Invitation {
	return {
		accountId: data.user.id as string,
		actionLink: data.properties.action_link as string
	};
}

async function linkContactToAccount(
	supabase: SupabaseClient,
	contactId: string,
	accountId: string
): Promise<void> {
	const { error } = await supabase
		.from('client_contacts')
		.update({ account_id: accountId, invited_at: new Date().toISOString() })
		.eq('id', contactId);
	if (error) throw error;
}

// The account exists once the link is minted; a failed email must not undo it,
// so the failure is logged and staff can invite again.
async function deliverInvitation(contact: ClientContact, setPasswordUrl: string): Promise<void> {
	try {
		await sendTransactionalEmail({
			to: contact.email,
			subject: clientInviteEmailSubject('Your Business Today'),
			html: renderClientInviteEmail(contact.name, setPasswordUrl)
		});
	} catch (failure) {
		console.error('Client invite email failed', failure);
	}
}
