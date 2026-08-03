import type { SupabaseClient } from '@supabase/supabase-js';

export async function addTaskComment(
	supabase: SupabaseClient,
	taskId: string,
	authorId: string,
	body: string
): Promise<void> {
	const { error } = await supabase
		.from('task_comments')
		.insert({ task_id: taskId, author_id: authorId, body });
	if (error) throw error;
}
