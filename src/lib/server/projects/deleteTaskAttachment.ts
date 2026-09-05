import type { SupabaseClient } from '@supabase/supabase-js';
import { removeAttachmentFiles } from './attachmentFiles';
import type { TaskAttachment } from './attachmentRecord';

export async function deleteTaskAttachment(
	supabase: SupabaseClient,
	attachment: TaskAttachment
): Promise<void> {
	await removeAttachmentFiles(supabase, [attachment.storagePath]);
	const { error } = await supabase.from('task_attachments').delete().eq('id', attachment.id);
	if (error) throw error;
}
