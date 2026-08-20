import type { SupabaseClient } from '@supabase/supabase-js';
import type { ResolvedAccount } from './resolveAccountByEmail';
import type { ShareScope } from '$lib/data/sharingTypes';

export async function createWorkspaceShare(
	supabase: SupabaseClient,
	collaborator: ResolvedAccount,
	scope: ShareScope,
	targetId: string
): Promise<'created' | 'already_shared'> {
	const { error } = await supabase.from('workspace_shares').insert({
		collaborator_id: collaborator.id,
		collaborator_email: collaborator.email,
		entity_id: scope === 'entity' ? targetId : null,
		brain_id: scope === 'brain' ? targetId : null
	});
	if (error === null) return 'created';
	if (error.code === '23505') return 'already_shared';
	throw error;
}

export async function deleteWorkspaceShare(
	supabase: SupabaseClient,
	shareId: string
): Promise<void> {
	const { error } = await supabase.from('workspace_shares').delete().eq('id', shareId);
	if (error !== null) throw error;
}
