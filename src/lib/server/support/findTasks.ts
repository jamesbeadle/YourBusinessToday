import type { SupabaseClient } from '@supabase/supabase-js';
import { parseTaskRecord, type ProjectTask } from '$lib/server/projects/taskRecord';
import { matchingAnyOf, wordsOf } from '$lib/server/search/wordMatch';

const mostMatches = 20;

export type TaskSearch = {
	projectId: string;
	goalId: string | null;
	phrase: string;
};

export async function findTasks(supabase: SupabaseClient, search: TaskSearch): Promise<ProjectTask[]> {
	let query = supabase.from('tasks').select('*').eq('project_id', search.projectId);
	if (search.goalId !== null) query = query.eq('goal_id', search.goalId);
	for (const word of wordsOf(search.phrase)) {
		query = query.or(matchingAnyOf(['title', 'details', 'story_want'], word));
	}
	const { data, error } = await query
		.order('status', { ascending: true })
		.order('priority', { ascending: true })
		.limit(mostMatches);
	if (error) throw error;
	return data.map(parseTaskRecord);
}
