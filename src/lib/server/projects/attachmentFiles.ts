import type { SupabaseClient } from '@supabase/supabase-js';
import { attachmentsBucket } from './attachmentStorage';

export async function removeAttachmentFiles(
	supabase: SupabaseClient,
	storagePaths: string[]
): Promise<void> {
	if (storagePaths.length === 0) return;
	const { error } = await supabase.storage.from(attachmentsBucket).remove(storagePaths);
	if (error !== null) throw error;
}

export async function getAttachmentPathsForTasks(
	supabase: SupabaseClient,
	taskIds: string[]
): Promise<string[]> {
	const { data, error } = await supabase
		.from('task_attachments')
		.select('storage_path')
		.in('task_id', taskIds);
	if (error) throw error;
	return data.map((row) => row.storage_path as string);
}

export async function getAttachmentPathsForProject(
	supabase: SupabaseClient,
	projectId: string
): Promise<string[]> {
	const { data, error } = await supabase
		.from('task_attachments')
		.select('storage_path, tasks!inner(project_id)')
		.eq('tasks.project_id', projectId);
	if (error) throw error;
	return data.map((row) => row.storage_path as string);
}
