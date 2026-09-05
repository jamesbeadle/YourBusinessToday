import { sendTransactionalEmail } from '../email/sendTransactionalEmail';
import { chatbotInviteEmailSubject, renderChatbotInviteEmail } from '../email/chatbotInviteEmail';
import type { EmailDelivery } from '$lib/data/emailDelivery';
import type { SupabaseClient } from '@supabase/supabase-js';

export type InviteOutcome = 'already_invited' | EmailDelivery;

const duplicateRowCode = '23505';

// The membership row exists once the insert succeeds; an undelivered email
// must not undo it, so the delivery status travels back for the owner to see.
export async function inviteChatbotMember(
	supabase: SupabaseClient,
	chatbot: { id: string; name: string },
	invitedEmail: string,
	inviterEmail: string,
	origin: string
): Promise<InviteOutcome> {
	const { error } = await supabase
		.from('chatbot_members')
		.insert({ chatbot_id: chatbot.id, invited_email: invitedEmail.toLowerCase() });
	if (error !== null && error.code === duplicateRowCode) return 'already_invited';
	if (error !== null) throw error;
	return sendTransactionalEmail({
		to: invitedEmail,
		subject: chatbotInviteEmailSubject(inviterEmail, chatbot.name),
		html: renderChatbotInviteEmail(inviterEmail, chatbot.name, `${origin}/chatbots/${chatbot.id}`)
	});
}
