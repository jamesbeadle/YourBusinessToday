import type { SupabaseClient } from '@supabase/supabase-js';
import {
	getNextGlobalPriority,
	getNextSiblingPriority
} from '$lib/server/projects/nextTaskPriorities';

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
): Promise<string> {
	const globalPriority =
		seed.parentTaskId === null ? await getNextGlobalPriority(supabase, projectId) : null;
	const { data, error } = await supabase
		.from('tasks')
		.insert({
			project_id: projectId,
			parent_task_id: seed.parentTaskId,
			phase_id: seed.phaseId,
			title: seed.title,
			details: seed.details,
			due_date: seed.dueDate,
			priority: await getNextSiblingPriority(supabase, projectId, seed.parentTaskId),
			global_priority: globalPriority,
			created_by: createdBy
		})
		.select('id')
		.single();
	if (error) throw error;
	return data.id;
}

function emptyAsNull(value: string): string | null {
	if (value === '') return null;
	return value;
}
