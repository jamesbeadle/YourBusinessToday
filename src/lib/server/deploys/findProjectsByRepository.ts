import type { SupabaseClient } from '@supabase/supabase-js';
import { isSameRepository } from './repositoryUrlKey';
import { parseProjectRecord, type Project } from '$lib/server/projects/projectRecord';

/** Every project whose recorded repository is the one a webhook names, however either was spelled. */
export async function findProjectsByRepository(
	supabase: SupabaseClient,
	repositoryUrl: string
): Promise<Project[]> {
	const { data, error } = await supabase.from('projects').select('*').neq('repository_url', '');
	if (error) throw error;
	return data
		.map(parseProjectRecord)
		.filter((project) => isSameRepository(project.repositoryUrl, repositoryUrl));
}
