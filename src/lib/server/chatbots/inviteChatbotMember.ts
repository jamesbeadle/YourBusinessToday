import { deliverChatbotInvite, type ChatbotInvite } from './deliverChatbotInvite';
import type { SupabaseClient } from '@supabase/supabase-js';

export type InviteOutcome = 'invited' | 'already_invited';

const duplicateRowCode = '23505';

export async function inviteChatbotMember(
	supabase: SupabaseClient,
	invite: ChatbotInvite,
	allowanceCredits: number
): Promise<InviteOutcome> {
	const { error } = await supabase.from('chatbot_members').insert({
		chatbot_id: invite.chatbot.id,
		invited_email: invite.invitedEmail.toLowerCase(),
		allowance_credits: allowanceCredits
	});
	if (error !== null && error.code === duplicateRowCode) return 'already_invited';
	if (error !== null) throw error;
	await deliverOrLog(invite);
	return 'invited';
}

// The membership row exists once the insert succeeds; a failed email must
// not undo it, so the failure is logged and the owner can resend.
async function deliverOrLog(invite: ChatbotInvite): Promise<void> {
	try {
		await deliverChatbotInvite(invite);
	} catch (failure) {
		console.error('Chatbot invite email failed', failure);
	}
}
