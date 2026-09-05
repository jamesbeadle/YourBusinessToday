import type { SupabaseClient } from '@supabase/supabase-js';
import { attachmentsBucket, attachmentStoragePath } from './attachmentStorage';
import { saveAttachmentRecord } from './saveAttachmentRecord';
import type { AttachmentUpload } from './attachmentRecord';

export type AttachmentFile = AttachmentUpload & { bytes: Uint8Array };

export async function storeTaskAttachment(
	supabase: SupabaseClient,
	taskId: string,
	uploadedBy: string,
	file: AttachmentFile
): Promise<string> {
	const attachmentId = crypto.randomUUID();
	const storagePath = attachmentStoragePath(taskId, attachmentId, file.filename);
	const { error } = await supabase.storage
		.from(attachmentsBucket)
		.upload(storagePath, file.bytes, { contentType: file.mimeType });
	if (error !== null) throw error;
	await saveAttachmentRecord(supabase, {
		attachmentId,
		taskId,
		uploadedBy,
		storagePath,
		upload: { filename: file.filename, mimeType: file.mimeType, byteCount: file.byteCount }
	});
	return attachmentId;
}
