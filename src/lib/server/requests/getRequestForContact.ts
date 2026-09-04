import { isUuid } from '$lib/data/isUuid';
import { parseFeatureRequestReference } from '$lib/data/featureRequests';
import { featureRequestColumns, parseFeatureRequestRecord } from './featureRequestRecord';
import type { ClientRequest } from './getRequestsForClient';
import type { SupabaseClient } from '@supabase/supabase-js';

const contactRequestColumns = `${featureRequestColumns}, projects!inner(name, client_id), tasks(status)`;

// Callers name a request either by its row id or by the FR-0001 reference a
// person reads, so both are accepted here rather than in every caller.
export async function getRequestForContact(
	supabase: SupabaseClient,
	requestId: string,
	clientId: string
): Promise<ClientRequest | null> {
	const query = supabase
		.from('feature_requests')
		.select(contactRequestColumns)
		.eq('projects.client_id', clientId);
	const requestNumber = parseFeatureRequestReference(requestId);
	if (requestNumber !== null) query.eq('request_number', requestNumber);
	if (requestNumber === null && isUuid(requestId)) query.eq('id', requestId);
	if (requestNumber === null && !isUuid(requestId)) return null;
	const { data, error } = await query.maybeSingle();
	if (error) throw error;
	if (data === null) return null;
	const row = data as unknown as Record<string, any>;
	return {
		...parseFeatureRequestRecord(row),
		projectName: row.projects.name as string,
		isDelivered: row.tasks?.status === 'done'
	};
}
