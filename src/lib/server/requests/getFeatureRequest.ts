import type { SupabaseClient } from '@supabase/supabase-js';
import { featureRequestColumns } from './featureRequestRecord';
import { toQueuedRequest, type QueuedRequest } from './getTriageQueue';

export type RequestDetail = QueuedRequest & { isDelivered: boolean };

const detailColumns = `${featureRequestColumns}, projects(name, client_id, clients(name)), client_contacts(name), tasks(status)`;

export async function getFeatureRequest(
	supabase: SupabaseClient,
	requestId: string
): Promise<RequestDetail | null> {
	const { data, error } = await supabase
		.from('feature_requests')
		.select(detailColumns)
		.eq('id', requestId)
		.maybeSingle();
	if (error) throw error;
	if (data === null) return null;
	const row = data as unknown as Record<string, any>;
	return { ...toQueuedRequest(row), isDelivered: row.tasks?.status === 'done' };
}
