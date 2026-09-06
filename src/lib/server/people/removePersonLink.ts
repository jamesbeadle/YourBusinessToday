import type { SupabaseClient } from '@supabase/supabase-js';

export async function removeContactLink(supabase: SupabaseClient, linkId: string): Promise<void> {
	const { error } = await supabase.from('contact_links').delete().eq('id', linkId);
	if (error) throw error;
}
