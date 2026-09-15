import { tooManyInvitesMessage } from '$lib/server/email/inviteAllowance';
import { undeliveredInviteNotice } from '$lib/data/emailDelivery';
import type { ProjectInviteOutcome } from './inviteToProject';

export type InviteOutcomeMessage = { isRefusal: boolean; message: string };

const refusals: Record<string, string> = {
	is_the_owner: 'That is the owner — they are already on the project.',
	already_on_project: 'They are already on this project.',
	too_many_invites: tooManyInvitesMessage
};

export function inviteOutcomeMessage(
	outcome: ProjectInviteOutcome,
	email: string
): InviteOutcomeMessage {
	const refusal = refusals[outcome];
	if (refusal !== undefined) return { isRefusal: true, message: refusal };
	const delivery = outcome as Exclude<ProjectInviteOutcome, keyof typeof refusals>;
	const undelivered = undeliveredInviteNotice(delivery);
	if (undelivered !== null)
		return { isRefusal: false, message: `${email} is on the project. ${undelivered}` };
	return { isRefusal: false, message: `${email} is on the project and has been emailed.` };
}
