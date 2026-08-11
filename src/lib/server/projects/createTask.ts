import type { SupabaseClient } from '@supabase/supabase-js';
import { getProjectOwnerId } from '$lib/server/projects/getProjectOwnerId';

export type NewTaskSeed = {
	title: string;
	details: string;
	dueDate: string | null;
	phaseId: string | null;
	parentTaskId: string | null;
};

export function readNewTaskSeed(formData: FormData): NewTaskSeed | null {
	const title = String(formData.get('title') ?? '').trim();
	if (title === '') return null;
	return {
		title,
		details: String(formData.get('details') ?? '').trim(),
		dueDate: emptyAsNull(String(formData.get('dueDate') ?? '')),
		phaseId: emptyAsNull(String(formData.get('phaseId') ?? '')),
		parentTaskId: emptyAsNull(String(formData.get('parentTaskId') ?? ''))
	};
}

export async function createTask(
	supabase: SupabaseClient,
	projectId: string,
	seed: NewTaskSeed,
	createdBy: string
): Promise<void> {
	const nextPriority = (await getHighestSiblingPriority(supabase, projectId, seed)) + 1;
	const { error } = await supabase.from('tasks').insert({
		project_id: projectId,
		parent_task_id: seed.parentTaskId,
		phase_id: seed.phaseId,
		title: seed.title,
		details: seed.details,
		due_date: seed.dueDate,
		priority: nextPriority,
		global_priority: await nextGlobalPriority(supabase, projectId, seed),
		created_by: createdBy
	});
	if (error) throw error;
}

async function nextGlobalPriority(
	supabase: SupabaseClient,
	projectId: string,
	seed: NewTaskSeed
): Promise<number | null> {
	if (seed.parentTaskId !== null) return null;
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

async function getHighestSiblingPriority(
	supabase: SupabaseClient,
	projectId: string,
	seed: NewTaskSeed
): Promise<number> {
	const siblings = supabase.from('tasks').select('priority').eq('project_id', projectId);
	const scopedSiblings =
		seed.parentTaskId === null
			? siblings.is('parent_task_id', null)
			: siblings.eq('parent_task_id', seed.parentTaskId);
	const { data, error } = await scopedSiblings
		.order('priority', { ascending: false })
		.limit(1)
		.maybeSingle();
	if (error) throw error;
	return data?.priority ?? 0;
}

function emptyAsNull(value: string): string | null {
	if (value === '') return null;
	return value;
}
