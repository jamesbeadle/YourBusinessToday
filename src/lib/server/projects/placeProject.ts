import type { SupabaseClient } from '@supabase/supabase-js';
import { parseProjectRecord, type Project } from '$lib/server/projects/projectRecord';
import {
	reassignValuesInOrder,
	reorderByDrop,
	type DropPlacement
} from '$lib/server/projects/dropReorder';

export async function placeProject(
	supabase: SupabaseClient,
	movedProjectId: string,
	targetProjectId: string,
	placement: DropPlacement
): Promise<void> {
	const movedProject = await findProject(supabase, movedProjectId);
	if (movedProject === null) return;
	const projects = await getOwnerProjectsByPriority(supabase, movedProject.ownerId);
	const reorderedProjects = reorderByDrop(projects, movedProjectId, targetProjectId, placement);
	if (reorderedProjects === null) return;
	const priorityUpdates = reassignValuesInOrder(reorderedProjects, (project) => project.priority);
	await Promise.all(
		priorityUpdates.map((update) => setPriority(supabase, update.id, update.value))
	);
}

async function findProject(
	supabase: SupabaseClient,
	projectId: string
): Promise<Project | null> {
	const { data, error } = await supabase
		.from('projects')
		.select('*')
		.eq('id', projectId)
		.maybeSingle();
	if (error) throw error;
	if (data === null) return null;
	return parseProjectRecord(data);
}

async function getOwnerProjectsByPriority(
	supabase: SupabaseClient,
	ownerId: string
): Promise<Project[]> {
	const { data, error } = await supabase
		.from('projects')
		.select('*')
		.eq('owner_id', ownerId)
		.order('priority', { ascending: true });
	if (error) throw error;
	return data.map(parseProjectRecord);
}

async function setPriority(
	supabase: SupabaseClient,
	projectId: string,
	priority: number
): Promise<void> {
	const { error } = await supabase.from('projects').update({ priority }).eq('id', projectId);
	if (error) throw error;
}
