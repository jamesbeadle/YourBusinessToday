import type { ClientStage } from '$lib/data/clientLifecycle';
import type { SupabaseClient } from '@supabase/supabase-js';
import { recordClientEvent } from './recordClientEvent';

export async function moveClientStage(
	supabase: SupabaseClient,
	clientId: string,
	stage: ClientStage,
	actorAccountId: string
): Promise<void> {
	const { error } = await supabase
		.from('clients')
		.update({ lifecycle_stage: stage })
		.eq('id', clientId);
	if (error) throw error;
	await recordClientEvent(supabase, clientId, 'stage_moved', { to: stage }, actorAccountId);
}
