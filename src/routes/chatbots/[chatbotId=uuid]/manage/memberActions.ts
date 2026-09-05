import { fail } from '@sveltejs/kit';
import { inviteChatbotMember } from '$lib/server/chatbots/inviteChatbotMember';
import { isLadderModel } from '$lib/data/modelLadder';
import { parseInvitedAllowance, parseInvitedEmail } from '$lib/server/chatbots/parseInviteForm';
import { removeChatbotMember } from '$lib/server/chatbots/removeChatbotMember';
import { requireOwnedChatbot } from '$lib/server/chatbots/requireOwnedChatbot';
import { requireUser } from '$lib/server/auth/requireUser';
import { resendChatbotInvite } from '$lib/server/chatbots/resendChatbotInvite';
import { setMemberModel } from '$lib/server/chatbots/setMemberModel';
import { undeliveredInviteNotice } from '$lib/data/emailDelivery';
import type { RequestEvent } from './$types';

export async function inviteMember({ locals, params, request, url }: RequestEvent) {
	const user = await requireUser(locals);
	const chatbot = await requireOwnedChatbot(locals.supabase, params.chatbotId, user.id);
	const formData = await request.formData();
	const invitedEmail = parseInvitedEmail(formData);
	if (invitedEmail === '') return fail(400, { message: 'Enter an email address to invite.' });
	if (invitedEmail.toLowerCase() === (user.email ?? '').toLowerCase()) {
		return fail(400, { message: "That's your own address — invite someone else." });
	}
	const allowance = parseInvitedAllowance(formData);
	if (allowance === null) return fail(400, { message: 'The allowance must be a whole number of credits.' });
	const outcome = await inviteChatbotMember(
		locals.supabase,
		{ chatbot, invitedEmail, inviterEmail: user.email ?? '', origin: url.origin },
		allowance
	);
	if (outcome === 'already_invited') return fail(400, { message: 'That address is already a member.' });
	const undelivered = undeliveredInviteNotice(outcome);
	if (undelivered !== null) return { message: undelivered };
}

export async function resendInvite({ locals, params, request, url }: RequestEvent) {
	const user = await requireUser(locals);
	const chatbot = await requireOwnedChatbot(locals.supabase, params.chatbotId, user.id);
	const formData = await request.formData();
	const outcome = await resendChatbotInvite(
		locals.supabase,
		chatbot,
		memberIdFrom(formData),
		user.email ?? '',
		url.origin
	);
	if (outcome === 'no_pending_invite') return fail(404, { message: 'That person has already joined.' });
	const undelivered = undeliveredInviteNotice(outcome);
	if (undelivered !== null) return fail(502, { message: undelivered });
}

export async function removeMember({ locals, params, request }: RequestEvent) {
	const user = await requireUser(locals);
	await requireOwnedChatbot(locals.supabase, params.chatbotId, user.id);
	const formData = await request.formData();
	await removeChatbotMember(locals.supabase, memberIdFrom(formData));
}

export async function setMemberModelOverride({ locals, params, request }: RequestEvent) {
	const user = await requireUser(locals);
	await requireOwnedChatbot(locals.supabase, params.chatbotId, user.id);
	const formData = await request.formData();
	const modelId = String(formData.get('modelId') ?? '');
	if (modelId !== '' && !isLadderModel(modelId)) {
		return fail(400, { message: 'That is not a model on the ladder.' });
	}
	await setMemberModel(locals.supabase, memberIdFrom(formData), modelId === '' ? null : modelId);
}

function memberIdFrom(formData: FormData): string {
	return String(formData.get('memberId') ?? '');
}
