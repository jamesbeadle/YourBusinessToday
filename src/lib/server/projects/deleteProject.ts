import type { SupabaseClient } from '@supabase/supabase-js';
import { getAttachmentPathsForProject, removeAttachmentFiles } from './attachmentFiles';

export async function deleteProject(supabase: SupabaseClient, projectId: string): Promise<void> {
	await removeAttachmentFiles(supabase, await getAttachmentPathsForProject(supabase, projectId));
	const { error } = await supabase.from('projects').delete().eq('id', projectId);
	if (error) throw error;
}
