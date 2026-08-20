import { error, json } from '@sveltejs/kit';
import { createWorkspaceShare, deleteWorkspaceShare } from '$lib/server/sharing/createWorkspaceShare';
import { resolveAccountByEmail } from '$lib/server/sharing/resolveAccountByEmail';
import type { RequestHandler } from './$types';
import type { ShareScope } from '$lib/data/sharingTypes';

export const POST: RequestHandler = async ({ locals, request }) => {
	const { user } = await locals.safeGetSession();
	if (user === null) error(401, 'Sign in to share your workspace');

	const payload = await request.json();
	const { scope, targetId } = readTarget(payload);
	const email = typeof payload.email === 'string' ? payload.email.trim() : '';
	if (email === '') error(400, 'An email is required');
	if (email.toLowerCase() === (user.email ?? '').toLowerCase()) {
		error(400, 'That is your own account');
	}

	const collaborator = await resolveAccountByEmail(locals.supabase, email);
	if (collaborator === null) error(404, 'No Your Business Today account has that email');

	const outcome = await createWorkspaceShare(locals.supabase, collaborator, scope, targetId);
	if (outcome === 'already_shared') error(409, 'Already shared with that account');
	return json({ collaboratorEmail: collaborator.email });
};

export const DELETE: RequestHandler = async ({ locals, request }) => {
	const { user } = await locals.safeGetSession();
	if (user === null) error(401, 'Sign in to manage your shares');

	const payload = await request.json();
	const shareId = typeof payload.shareId === 'string' ? payload.shareId : '';
	if (shareId === '') error(400, 'A share is required');
	await deleteWorkspaceShare(locals.supabase, shareId);
	return json({ isRemoved: true });
};

function readTarget(payload: Record<string, unknown>): { scope: ShareScope; targetId: string } {
	if (typeof payload.brainId === 'string' && payload.brainId !== '') {
		return { scope: 'brain', targetId: payload.brainId };
	}
	if (typeof payload.entityId === 'string' && payload.entityId !== '') {
		return { scope: 'entity', targetId: payload.entityId };
	}
	error(400, 'A brain or an entity is required');
}
