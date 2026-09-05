import type { SupabaseClient } from '@supabase/supabase-js';
import { getAttachmentPathsForTasks, removeAttachmentFiles } from './attachmentFiles';
import { getTaskAndDescendantIds } from './getTaskAndDescendantIds';

export async function deleteTask(supabase: SupabaseClient, taskId: string): Promise<void> {
	const familyIds = await getTaskAndDescendantIds(supabase, taskId);
	await removeAttachmentFiles(supabase, await getAttachmentPathsForTasks(supabase, familyIds));
	const { error } = await supabase.from('tasks').delete().eq('id', taskId);
	if (error) throw error;
}
