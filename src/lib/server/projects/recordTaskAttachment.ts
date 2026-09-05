import type { SupabaseClient } from '@supabase/supabase-js';
import { attachmentsBucket, attachmentStoragePath } from './attachmentStorage';
import type { AttachmentUpload } from './attachmentRecord';

export type AttachmentRecording = 'recorded' | 'file_missing';

export async function recordTaskAttachment(
	supabase: SupabaseClient,
	taskId: string,
	attachmentId: string,
	uploadedBy: string,
	upload: AttachmentUpload
): Promise<AttachmentRecording> {
	const storagePath = attachmentStoragePath(taskId, attachmentId, upload.filename);
	if (!(await isFileStored(supabase, storagePath))) return 'file_missing';
	const { error } = await supabase.from('task_attachments').insert({
		id: attachmentId,
		task_id: taskId,
		filename: upload.filename,
		mime_type: upload.mimeType,
		byte_count: upload.byteCount,
		storage_path: storagePath,
		uploaded_by: uploadedBy
	});
	if (error !== null) throw error;
	return 'recorded';
}

async function isFileStored(supabase: SupabaseClient, storagePath: string): Promise<boolean> {
	const { data: isStored } = await supabase.storage.from(attachmentsBucket).exists(storagePath);
	return isStored;
}
