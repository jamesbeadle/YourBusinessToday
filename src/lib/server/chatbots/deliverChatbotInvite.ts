import { sendTransactionalEmail } from '../email/sendTransactionalEmail';
import { chatbotInviteEmailSubject, renderChatbotInviteEmail } from '../email/chatbotInviteEmail';

export type ChatbotInvite = {
	chatbot: { id: string; name: string };
	invitedEmail: string;
	inviterEmail: string;
	origin: string;
};

export async function deliverChatbotInvite(invite: ChatbotInvite): Promise<void> {
	const { chatbot, invitedEmail, inviterEmail, origin } = invite;
	await sendTransactionalEmail({
		to: invitedEmail,
		subject: chatbotInviteEmailSubject(inviterEmail, chatbot.name),
		html: renderChatbotInviteEmail(inviterEmail, chatbot.name, `${origin}/chatbots/${chatbot.id}`)
	});
}
