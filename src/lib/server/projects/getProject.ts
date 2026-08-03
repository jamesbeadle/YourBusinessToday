import type { SupabaseClient } from '@supabase/supabase-js';
import { parseProjectRecord, type Project } from '$lib/server/projects/projectRecord';

export async function getProject(
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
