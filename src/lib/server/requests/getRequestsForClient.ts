import type { SupabaseClient } from '@supabase/supabase-js';
import {
	featureRequestColumns,
	parseFeatureRequestRecord,
	type FeatureRequest
} from './featureRequestRecord';

export type ClientRequest = FeatureRequest & {
	projectName: string;
	isDelivered: boolean;
};

const clientRequestColumns = `${featureRequestColumns}, projects!inner(name, client_id), tasks(status)`;

export async function getRequestsForClient(
	supabase: SupabaseClient,
	clientId: string
): Promise<ClientRequest[]> {
	const { data, error } = await supabase
		.from('feature_requests')
		.select(clientRequestColumns)
		.eq('projects.client_id', clientId)
		.order('created_at', { ascending: false });
	if (error) throw error;
	return (data as unknown as Record<string, any>[]).map((row) => ({
		...parseFeatureRequestRecord(row),
		projectName: row.projects.name as string,
		isDelivered: row.tasks?.status === 'done'
	}));
}
