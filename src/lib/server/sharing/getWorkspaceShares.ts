import type { SupabaseClient } from '@supabase/supabase-js';
import type { DomainBrain } from '$lib/server/entities/getDomainBrain';
import type { WorkspaceShare } from '$lib/data/sharingTypes';

export async function getSharesForBrain(
	supabase: SupabaseClient,
	brain: DomainBrain
): Promise<WorkspaceShare[]> {
	const { data, error } = await supabase
		.from('workspace_shares')
		.select('id, collaborator_email, entity_id, brain_id, created_at')
		.or(`brain_id.eq.${brain.id},entity_id.eq.${brain.entityId}`)
		.order('created_at');
	if (error !== null) throw error;
	return (data ?? []).map((row) => ({
		id: row.id,
		collaboratorEmail: row.collaborator_email,
		scope: row.brain_id === null ? 'entity' : 'brain',
		createdAt: row.created_at
	}));
}
