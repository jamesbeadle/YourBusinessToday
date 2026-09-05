import { deserialize } from '$app/forms';
import { attachmentLimitDescription, isWithinAttachmentLimit } from '$lib/data/taskAttachmentRules';
import type { ActionResult } from '@sveltejs/kit';
import type { AttachmentUpload } from '$lib/server/projects/attachmentRecord';

export type AttachmentUploadOutcome = { status: 'uploaded' } | { status: 'failed'; message: string };

const unknownMimeType = 'application/octet-stream';

export async function uploadTaskAttachment(file: File): Promise<AttachmentUploadOutcome> {
	if (!isWithinAttachmentLimit(file.size)) {
		return { status: 'failed', message: `That file is too large. ${attachmentLimitDescription()}` };
	}
	const upload = describeUpload(file);
	const grant = await postAction('?/grantAttachment', upload);
	if (grant.type !== 'success') return failureFrom(grant, 'The upload could not be started.');
	const storageResponse = await fetch(String(grant.data?.uploadUrl), {
		method: 'PUT',
		headers: { 'content-type': upload.mimeType },
		body: file
	});
	if (!storageResponse.ok) return { status: 'failed', message: 'The file could not be uploaded.' };
	const attachmentId = String(grant.data?.attachmentId);
	const recording = await postAction('?/recordAttachment', { ...upload, attachmentId });
	if (recording.type !== 'success') return failureFrom(recording, 'The upload could not be saved.');
	return { status: 'uploaded' };
}

function describeUpload(file: File): AttachmentUpload {
	return {
		filename: file.name,
		mimeType: file.type === '' ? unknownMimeType : file.type,
		byteCount: file.size
	};
}

async function postAction(
	action: string,
	fields: Record<string, string | number>
): Promise<ActionResult> {
	const formData = new FormData();
	for (const [fieldName, fieldValue] of Object.entries(fields)) {
		formData.set(fieldName, String(fieldValue));
	}
	const response = await fetch(action, {
		method: 'POST',
		headers: { accept: 'application/json', 'x-sveltekit-action': 'true' },
		cache: 'no-store',
		body: formData
	});
	return deserialize(await response.text());
}

function failureFrom(result: ActionResult, fallbackMessage: string): AttachmentUploadOutcome {
	if (result.type !== 'failure') return { status: 'failed', message: fallbackMessage };
	const message = result.data?.message;
	return { status: 'failed', message: typeof message === 'string' ? message : fallbackMessage };
}
