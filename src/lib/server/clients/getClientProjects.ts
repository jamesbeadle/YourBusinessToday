import type { SupabaseClient } from '@supabase/supabase-js';

export type ClientProject = {
	id: string;
	name: string;
	repositoryUrl: string;
	environmentUrl: string;
	openRequestCount: number;
};

export async function getClientProjects(
	supabase: SupabaseClient,
	clientId: string
): Promise<ClientProject[]> {
	const { data, error } = await supabase
		.from('projects')
		.select('id, name, repository_url, environment_url, feature_requests(status)')
		.eq('client_id', clientId)
		.order('name');
	if (error) throw error;
	return data.map(toClientProject);
}

function toClientProject(row: Record<string, unknown>): ClientProject {
	const requests = (row.feature_requests ?? []) as { status: string }[];
	return {
		id: row.id as string,
		name: row.name as string,
		repositoryUrl: row.repository_url as string,
		environmentUrl: row.environment_url as string,
		openRequestCount: requests.filter((request) => request.status === 'new').length
	};
}
