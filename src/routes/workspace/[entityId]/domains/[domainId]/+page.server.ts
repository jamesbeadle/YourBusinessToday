import { error, fail, redirect } from '@sveltejs/kit';
import { deleteDomainBrain } from '$lib/server/entities/deleteDomainBrain';
import { getBrainContexts } from '$lib/server/brain/getBrainContexts';
import { getBrainConversationThread } from '$lib/server/brain/getBrainConversation';
import { getBrainEvents } from '$lib/server/brain/getBrainEvents';
import { getBrainPageIndex } from '$lib/server/brain/getBrainPageIndex';
import { getBrainPageLinks } from '$lib/server/brain/getBrainPageLinks';
import { getBrainSources } from '$lib/server/brain/getBrainSources';
import { getDomainBrain } from '$lib/server/entities/getDomainBrain';
import { getPendingProposals } from '$lib/server/sharing/getPendingProposals';
import { getInvitesForBrain } from '$lib/server/sharing/workspaceInvites';
import { getSharesForBrain } from '$lib/server/sharing/getWorkspaceShares';
import { requireUser } from '$lib/server/auth/requireUser';
import { updateDomainBrainGoal } from '$lib/server/entities/updateDomainBrainGoal';
import type { DomainBrain } from '$lib/server/entities/getDomainBrain';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const user = await requireUser(locals);
	const brain = await getDomainBrain(locals.supabase, params.domainId);
	if (brain === null || brain.entityId !== params.entityId) {
		error(404, 'That domain brain is not in this entity');
	}
	const isOwner = brain.ownerId === user.id;
	return {
		brain,
		isOwner,
		sources: await getBrainSources(locals.supabase, brain.id),
		contexts: await getBrainContexts(locals.supabase, brain.id),
		pageIndex: await getBrainPageIndex(locals.supabase, brain.id),
		pageLinks: await getBrainPageLinks(locals.supabase, brain.id),
		events: await getBrainEvents(locals.supabase, brain.id),
		conversation: await getBrainConversationThread(locals.supabase, brain.id, 'brain'),
		proposals: isOwner ? await getPendingProposals(locals.supabase, brain.id) : [],
		shares: isOwner ? await getSharesForBrain(locals.supabase, brain) : [],
		invites: isOwner ? await getInvitesForBrain(locals.supabase, brain) : []
	};
};

export const actions: Actions = {
	updateDomainGoal: async ({ locals, params, request }) => {
		const brain = await requireOwnedBrain(locals, params);
		const formData = await request.formData();
		const domainGoal = String(formData.get('domainGoal') ?? '').trim();
		if (domainGoal === '') {
			return fail(400, { message: 'A domain brain needs a goal — say what it should articulate.' });
		}
		await updateDomainBrainGoal(locals.supabase, brain.id, domainGoal);
		return {};
	},
	deleteDomainBrain: async ({ locals, params }) => {
		const brain = await requireOwnedBrain(locals, params);
		await deleteDomainBrain(locals.supabase, brain.id);
		redirect(303, `/workspace/${params.entityId}`);
	}
};

async function requireOwnedBrain(
	locals: App.Locals,
	params: { entityId: string; domainId: string }
): Promise<DomainBrain> {
	const user = await requireUser(locals);
	const brain = await getDomainBrain(locals.supabase, params.domainId);
	if (brain === null || brain.entityId !== params.entityId) {
		error(404, 'That domain brain is not in this entity');
	}
	if (brain.ownerId !== user.id) error(403, 'Only the owner can change this domain brain');
	return brain;
}
