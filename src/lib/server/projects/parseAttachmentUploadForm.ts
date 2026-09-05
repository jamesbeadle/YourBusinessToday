import { isUuid } from '$lib/data/isUuid';
import type { AttachmentUpload } from '$lib/server/projects/attachmentRecord';

export function parseAttachmentUploadForm(formData: FormData): AttachmentUpload | null {
	const filename = String(formData.get('filename') ?? '').trim();
	const mimeType = String(formData.get('mimeType') ?? '').trim();
	const byteCount = Number(formData.get('byteCount'));
	if (filename === '' || mimeType === '' || !Number.isInteger(byteCount)) return null;
	return { filename, mimeType, byteCount };
}

export function parseAttachmentId(formData: FormData): string | null {
	const attachmentId = String(formData.get('attachmentId') ?? '');
	if (!isUuid(attachmentId)) return null;
	return attachmentId;
}
