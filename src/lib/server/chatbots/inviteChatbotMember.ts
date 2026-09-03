import { sendTransactionalEmail } from '../email/sendTransactionalEmail';
import { chatbotInviteEmailSubject, renderChatbotInviteEmail } from '../email/chatbotInviteEmail';
import type { SupabaseClient } from '@supabase/supabase-js';

export type InviteOutcome = 'invited' | 'already_invited';

const duplicateRowCode = '23505';

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
	await deliverInvite(chatbot, invitedEmail, inviterEmail, origin);
	return 'invited';
}

// The membership row exists once the insert succeeds; a failed email must
// not undo it, so the failure is logged and the owner can resend later.
async function deliverInvite(
	chatbot: { id: string; name: string },
	invitedEmail: string,
	inviterEmail: string,
	origin: string
): Promise<void> {
	try {
		await sendTransactionalEmail({
			to: invitedEmail,
			subject: chatbotInviteEmailSubject(inviterEmail, chatbot.name),
			html: renderChatbotInviteEmail(inviterEmail, chatbot.name, `${origin}/chatbots/${chatbot.id}`)
		});
	} catch (failure) {
		console.error('Chatbot invite email failed', failure);
	}
}
