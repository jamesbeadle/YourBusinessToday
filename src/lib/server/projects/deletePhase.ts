import type { SupabaseClient } from '@supabase/supabase-js';

export async function deletePhase(supabase: SupabaseClient, phaseId: string): Promise<void> {
	const { error } = await supabase.from('phases').delete().eq('id', phaseId);
	if (error) throw error;
}
