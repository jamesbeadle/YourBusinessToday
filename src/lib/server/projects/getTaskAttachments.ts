import type { SupabaseClient } from '@supabase/supabase-js';
import { parseAttachmentRecord, type TaskAttachment } from '$lib/server/projects/attachmentRecord';

export async function getTaskAttachments(
	supabase: SupabaseClient,
	taskId: string
): Promise<TaskAttachment[]> {
	const { data, error } = await supabase
		.from('task_attachments')
		.select('*')
		.eq('task_id', taskId)
		.order('created_at', { ascending: true });
	if (error) throw error;
	return data.map(parseAttachmentRecord);
}
