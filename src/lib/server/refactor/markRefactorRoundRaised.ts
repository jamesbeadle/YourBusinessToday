import type { SupabaseClient } from '@supabase/supabase-js';

export async function markRefactorRoundRaised(
	supabase: SupabaseClient,
	projectId: string,
	raisedAt: Date
): Promise<void> {
	const { error } = await supabase
		.from('projects')
		.update({ last_refactor_raised_at: raisedAt.toISOString() })
		.eq('id', projectId);
	if (error) throw error;
}
