import type { SupabaseClient } from '@supabase/supabase-js';

export async function setTaskStoryPoints(
	supabase: SupabaseClient,
	taskId: string,
	storyPoints: number
): Promise<void> {
	const { error } = await supabase
		.from('tasks')
		.update({ story_points: storyPoints })
		.eq('id', taskId);
	if (error) throw error;
}
