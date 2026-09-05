import type { SupabaseClient } from '@supabase/supabase-js';
import { attachmentsBucket, attachmentStoragePath } from './attachmentStorage';
import { saveAttachmentRecord } from './saveAttachmentRecord';
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
	await saveAttachmentRecord(supabase, { attachmentId, taskId, uploadedBy, storagePath, upload });
	return 'recorded';
}

async function isFileStored(supabase: SupabaseClient, storagePath: string): Promise<boolean> {
	const { data: isStored } = await supabase.storage.from(attachmentsBucket).exists(storagePath);
	return isStored;
}
