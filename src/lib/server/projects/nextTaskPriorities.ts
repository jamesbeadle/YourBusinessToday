import type { SupabaseClient } from '@supabase/supabase-js';
import { getProjectOwnerId } from '$lib/server/projects/getProjectOwnerId';

export async function getNextSiblingPriority(
	supabase: SupabaseClient,
	projectId: string,
	parentTaskId: string | null
): Promise<number> {
	const siblings = supabase.from('tasks').select('priority').eq('project_id', projectId);
	const scopedSiblings =
		parentTaskId === null
			? siblings.is('parent_task_id', null)
			: siblings.eq('parent_task_id', parentTaskId);
	const { data, error } = await scopedSiblings
		.order('priority', { ascending: false })
		.limit(1)
		.maybeSingle();
	if (error) throw error;
	return (data?.priority ?? 0) + 1;
}

export async function getNextGlobalPriority(
	supabase: SupabaseClient,
	projectId: string
): Promise<number> {
	const listOwnerId = await getProjectOwnerId(supabase, projectId);
	const { data, error } = await supabase
		.from('tasks')
		.select('global_priority, projects!inner(owner_id)')
		.eq('projects.owner_id', listOwnerId)
		.not('global_priority', 'is', null)
		.order('global_priority', { ascending: false })
		.limit(1)
		.maybeSingle();
	if (error) throw error;
	return (data?.global_priority ?? 0) + 1;
}
