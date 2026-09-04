import { recordClientEvent } from '$lib/server/clients/recordClientEvent';
import type { SupabaseClient } from '@supabase/supabase-js';

export type RequestDecision = 'accepted' | 'declined';

export function parseRequestDecision(value: unknown): RequestDecision {
	if (value === 'declined') return 'declined';
	return 'accepted';
}

export async function decideFeatureRequest(
	supabase: SupabaseClient,
	request: { id: string; reference: string; clientId: string },
	decision: RequestDecision,
	note: string,
	actorAccountId: string
): Promise<void> {
	const { error } = await supabase
		.from('feature_requests')
		.update({
			status: decision,
			decision_note: note,
			decided_by: actorAccountId,
			decided_at: new Date().toISOString()
		})
		.eq('id', request.id);
	if (error) throw error;
	await recordClientEvent(
		supabase,
		request.clientId,
		'request_decided',
		{ reference: request.reference, decision },
		actorAccountId
	);
}
