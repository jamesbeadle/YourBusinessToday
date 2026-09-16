import type { SupabaseClient } from '@supabase/supabase-js';
import { parseProjectRecord, type Project } from '$lib/server/projects/projectRecord';
import { rankChanges } from '$lib/server/ordering/rankChanges';
import type { RankedScope } from '$lib/server/ordering/rankedScope';

/** An owner's board: their projects, ranked by `priority`. */
export function projectBoard(supabase: SupabaseClient, ownerId: string): RankedScope<Project> {
	return {
		load: () => loadBoard(supabase, ownerId),
		readRank: (project) => project.priority,
		save: (projectsInOrder) => saveBoard(supabase, projectsInOrder)
	};
}

export async function findProject(
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

async function loadBoard(supabase: SupabaseClient, ownerId: string): Promise<Project[]> {
	const { data, error } = await supabase
		.from('projects')
		.select('*')
		.eq('owner_id', ownerId)
		.order('priority', { ascending: true })
		.order('created_at', { ascending: true });
	if (error) throw error;
	return data.map(parseProjectRecord);
}

async function saveBoard(supabase: SupabaseClient, projectsInOrder: Project[]): Promise<void> {
	const changes = rankChanges(projectsInOrder, (project) => project.priority);
	await Promise.all(
		changes.map(async (change) => {
			const { error } = await supabase
				.from('projects')
				.update({ priority: change.rank })
				.eq('id', change.id);
			if (error) throw error;
		})
	);
}
