import type { SupabaseClient } from '@supabase/supabase-js';
import type { DomainBrain } from '$lib/server/entities/getDomainBrain';
import type { ShareScope, WorkspaceInvite } from '$lib/data/sharingTypes';

export async function createWorkspaceInvite(
	supabase: SupabaseClient,
	invite: { invitedEmail: string; invitedByEmail: string; scope: ShareScope; targetId: string }
): Promise<'created' | 'already_invited'> {
	const { error } = await supabase.from('workspace_invites').insert({
		invited_email: invite.invitedEmail,
		invited_by_email: invite.invitedByEmail,
		entity_id: invite.scope === 'entity' ? invite.targetId : null,
		brain_id: invite.scope === 'brain' ? invite.targetId : null
	});
	if (error === null) return 'created';
	if (error.code === '23505') return 'already_invited';
	throw error;
}

export async function getInvitesForBrain(
	supabase: SupabaseClient,
	brain: DomainBrain
): Promise<WorkspaceInvite[]> {
	const { data, error } = await supabase
		.from('workspace_invites')
		.select('id, invited_email, entity_id, brain_id, created_at')
		.is('claimed_at', null)
		.or(`brain_id.eq.${brain.id},entity_id.eq.${brain.entityId}`)
		.order('created_at');
	if (error !== null) throw error;
	return (data ?? []).map((row) => ({
		id: row.id,
		invitedEmail: row.invited_email,
		scope: row.brain_id === null ? 'entity' : 'brain',
		createdAt: row.created_at
	}));
}

export async function deleteWorkspaceInvite(
	supabase: SupabaseClient,
	inviteId: string
): Promise<void> {
	const { error } = await supabase.from('workspace_invites').delete().eq('id', inviteId);
	if (error !== null) throw error;
}
