import type { SupabaseClient } from '@supabase/supabase-js';
import { attachmentsBucket, attachmentStoragePath } from './attachmentStorage';
import type { AttachmentUpload } from './attachmentRecord';

export type AttachmentUploadGrant = {
	attachmentId: string;
	uploadUrl: string;
};

export async function grantAttachmentUpload(
	supabase: SupabaseClient,
	taskId: string,
	upload: AttachmentUpload
): Promise<AttachmentUploadGrant> {
	const attachmentId = crypto.randomUUID();
	const storagePath = attachmentStoragePath(taskId, attachmentId, upload.filename);
	const { data, error } = await supabase.storage
		.from(attachmentsBucket)
		.createSignedUploadUrl(storagePath);
	if (error !== null) throw error;
	return { attachmentId, uploadUrl: data.signedUrl };
}
