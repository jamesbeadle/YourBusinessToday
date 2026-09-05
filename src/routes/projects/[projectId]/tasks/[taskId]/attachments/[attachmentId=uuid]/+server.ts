import { error, redirect } from '@sveltejs/kit';
import { findTaskAttachment } from '$lib/server/projects/findTaskAttachment';
import { requireStaff } from '$lib/server/auth/requireStaff';
import {
	clickThroughLifetimeSeconds,
	signAttachmentLink,
	type AttachmentLinkKind
} from '$lib/server/projects/signAttachmentLink';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params, url }) => {
	await requireStaff(locals);
	const attachment = await findTaskAttachment(locals.supabase, params.taskId, params.attachmentId);
	if (attachment === null) error(404, 'Attachment not found');
	const signedLink = await signAttachmentLink(
		locals.supabase,
		attachment,
		linkKindFrom(url),
		clickThroughLifetimeSeconds
	);
	redirect(303, signedLink);
};

function linkKindFrom(url: URL): AttachmentLinkKind {
	if (url.searchParams.has('download')) return 'download';
	return 'open';
}
