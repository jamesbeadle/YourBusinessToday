import type { FeatureRequestStatus } from '$lib/data/featureRequests';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
	featureRequestColumns,
	parseFeatureRequestRecord,
	type FeatureRequest
} from './featureRequestRecord';

export type QueuedRequest = FeatureRequest & {
	projectName: string;
	clientId: string;
	clientName: string;
	raisedByName: string;
};

const listedColumns = `${featureRequestColumns}, projects(name, client_id, clients(name)), client_contacts(name)`;

export async function getTriageQueue(
	supabase: SupabaseClient,
	status: FeatureRequestStatus | null
): Promise<QueuedRequest[]> {
	const query = supabase.from('feature_requests').select(listedColumns);
	if (status !== null) query.eq('status', status);
	const { data, error } = await query.order('created_at', { ascending: false });
	if (error) throw error;
	return (data as unknown as Record<string, any>[]).map(toQueuedRequest);
}

export function toQueuedRequest(row: Record<string, any>): QueuedRequest {
	return {
		...parseFeatureRequestRecord(row),
		projectName: row.projects.name as string,
		clientId: row.projects.client_id as string,
		clientName: (row.projects.clients?.name ?? '') as string,
		raisedByName: (row.client_contacts?.name ?? '') as string
	};
}
