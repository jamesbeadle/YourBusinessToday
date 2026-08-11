import type { SupabaseClient } from '@supabase/supabase-js';
import { parseProjectRecord, type Project } from '$lib/server/projects/projectRecord';

export type ProjectMoveDirection = 'up' | 'down';

export async function moveProject(
	supabase: SupabaseClient,
	projectId: string,
	direction: ProjectMoveDirection
): Promise<void> {
	const { data, error } = await supabase
		.from('projects')
		.select('*')
		.eq('id', projectId)
		.maybeSingle();
	if (error) throw error;
	if (data === null) return;
	const project = parseProjectRecord(data);
	const neighbour = await findNeighbour(supabase, project, direction);
	if (neighbour === null) return;
	await setPriority(supabase, project.id, neighbour.priority);
	await setPriority(supabase, neighbour.id, project.priority);
}

async function findNeighbour(
	supabase: SupabaseClient,
	project: Project,
	direction: ProjectMoveDirection
): Promise<Project | null> {
	const isMovingUp = direction === 'up';
	const { data, error } = await supabase
		.from('projects')
		.select('*')
		.eq('owner_id', project.ownerId)
		.filter('priority', isMovingUp ? 'lt' : 'gt', project.priority)
		.order('priority', { ascending: !isMovingUp })
		.limit(1)
		.maybeSingle();
	if (error) throw error;
	if (data === null) return null;
	return parseProjectRecord(data);
}

async function setPriority(
	supabase: SupabaseClient,
	projectId: string,
	priority: number
): Promise<void> {
	const { error } = await supabase.from('projects').update({ priority }).eq('id', projectId);
	if (error) throw error;
}
