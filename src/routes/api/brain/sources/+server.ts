import { error, json } from '@sveltejs/kit';
import { createBrainSource } from '$lib/server/brain/createBrainSource';
import { isAcceptedUpload, uploadLimitDescription } from '$lib/data/brainUploadRules';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const { user } = await locals.safeGetSession();
	if (user === null) error(401, 'Sign in to add documents to your Second Brain');

	const upload = await readUploadRequest(request);
	if (!isAcceptedUpload(upload.mimeType, upload.byteCount)) {
		error(400, `That file type or size is not supported. ${uploadLimitDescription()}`);
	}

	const grant = await createBrainSource(locals.supabase, user.id, upload);
	return json(grant);
};

async function readUploadRequest(
	request: Request
): Promise<{ filename: string; mimeType: string; byteCount: number }> {
	const payload = await request.json();
	const filename = typeof payload.filename === 'string' ? payload.filename.trim() : '';
	const mimeType = typeof payload.mimeType === 'string' ? payload.mimeType : '';
	const byteCount = Number(payload.byteCount);
	if (filename === '' || mimeType === '' || !Number.isInteger(byteCount)) {
		error(400, 'A filename, mime type, and byte count are required');
	}
	return { filename, mimeType, byteCount };
}
