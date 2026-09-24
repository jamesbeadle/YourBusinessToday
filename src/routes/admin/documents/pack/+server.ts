import { requireAdmin } from '$lib/server/admin/requireAdmin';
import { attachmentResponse } from '$lib/server/clientDocuments/attachmentResponse';
import { buildClientPack, clientPackFileName } from '$lib/server/clientDocuments/buildClientPack';
import type { RequestHandler } from './$types';

const zipContentType = 'application/zip';

export const GET: RequestHandler = async ({ locals }) => {
	await requireAdmin(locals);
	return attachmentResponse(buildClientPack(), clientPackFileName, zipContentType);
};
