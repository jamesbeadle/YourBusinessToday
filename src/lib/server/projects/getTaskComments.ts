import type { SupabaseClient } from '@supabase/supabase-js';

export type TaskComment = {
	id: string;
	authorId: string;
	body: string;
	createdAt: string;
};

export async function getTaskComments(
	supabase: SupabaseClient,
	taskId: string
): Promise<TaskComment[]> {
	const { data, error } = await supabase
		.from('task_comments')
		.select('*')
		.eq('task_id', taskId)
		.order('created_at', { ascending: true });
	if (error) throw error;
	return data.map((row: Record<string, unknown>) => ({
		id: row.id as string,
		authorId: row.author_id as string,
		body: row.body as string,
		createdAt: row.created_at as string
	}));
}
