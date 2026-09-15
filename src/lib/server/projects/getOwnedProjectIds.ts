import type { SupabaseClient } from '@supabase/supabase-js';

export async function getOwnedProjectIds(
	supabase: SupabaseClient,
	ownerId: string
): Promise<string[]> {
	const { data, error } = await supabase.from('projects').select('id').eq('owner_id', ownerId);
	if (error) throw error;
	return data.map((row: Record<string, unknown>) => row.id as string);
}
