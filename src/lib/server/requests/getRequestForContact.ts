import type { SupabaseClient } from '@supabase/supabase-js';
import {
	featureRequestColumns,
	parseFeatureRequestRecord
} from './featureRequestRecord';
import type { ClientRequest } from './getRequestsForClient';

const contactRequestColumns = `${featureRequestColumns}, projects(name), tasks(status)`;

export async function getRequestForContact(
	supabase: SupabaseClient,
	requestId: string
): Promise<ClientRequest | null> {
	const { data, error } = await supabase
		.from('feature_requests')
		.select(contactRequestColumns)
		.eq('id', requestId)
		.maybeSingle();
	if (error) throw error;
	if (data === null) return null;
	const row = data as unknown as Record<string, any>;
	return {
		...parseFeatureRequestRecord(row),
		projectName: row.projects.name as string,
		isDelivered: row.tasks?.status === 'done'
	};
}
