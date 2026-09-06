import type { SupabaseClient } from '@supabase/supabase-js';

export async function updateContactRole(
	supabase: SupabaseClient,
	contactId: string,
	role: string
): Promise<void> {
	const { error } = await supabase.from('client_contacts').update({ role }).eq('id', contactId);
	if (error) throw error;
}
