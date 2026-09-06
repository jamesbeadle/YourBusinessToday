import type { SupabaseClient } from '@supabase/supabase-js';

export async function removePersonLink(supabase: SupabaseClient, linkId: string): Promise<void> {
	const { error } = await supabase.from('person_links').delete().eq('id', linkId);
	if (error) throw error;
}
