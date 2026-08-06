import type { SupabaseClient } from '@supabase/supabase-js';
import type { ProjectStatus } from '$lib/data/projectStatus';

export type ProjectDetailsUpdate = {
	name: string;
	description: string;
	status: ProjectStatus;
};

export async function updateProjectDetails(
	supabase: SupabaseClient,
	projectId: string,
	update: ProjectDetailsUpdate
): Promise<void> {
	const { error } = await supabase
		.from('projects')
		.update({ name: update.name, description: update.description, status: update.status })
		.eq('id', projectId);
	if (error) throw error;
}
