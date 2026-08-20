import type { SupabaseClient } from '@supabase/supabase-js';

export async function renameEntity(
	supabase: SupabaseClient,
	entityId: string,
	name: string
): Promise<void> {
	const { error } = await supabase.from('entities').update({ name }).eq('id', entityId);
	if (error !== null) throw error;
}
