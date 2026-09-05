import type { SupabaseClient } from '@supabase/supabase-js';
import { parseAttachmentRecord, type TaskAttachment } from '$lib/server/projects/attachmentRecord';

export async function findTaskAttachment(
	supabase: SupabaseClient,
	taskId: string,
	attachmentId: string
): Promise<TaskAttachment | null> {
	const { data, error } = await supabase
		.from('task_attachments')
		.select('*')
		.eq('id', attachmentId)
		.eq('task_id', taskId)
		.maybeSingle();
	if (error) throw error;
	if (data === null) return null;
	return parseAttachmentRecord(data);
}
