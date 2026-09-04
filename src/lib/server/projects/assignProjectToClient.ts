import { recordClientEvent } from '$lib/server/clients/recordClientEvent';
import type { SupabaseClient } from '@supabase/supabase-js';

export type ProjectOwnership = {
	clientId: string | null;
	repositoryUrl: string;
	environmentUrl: string;
};

export function readProjectOwnership(formData: FormData): ProjectOwnership {
	const clientId = String(formData.get('clientId') ?? '');
	return {
		clientId: clientId === '' ? null : clientId,
		repositoryUrl: String(formData.get('repositoryUrl') ?? '').trim(),
		environmentUrl: String(formData.get('environmentUrl') ?? '').trim()
	};
}

export async function assignProjectToClient(
	supabase: SupabaseClient,
	projectId: string,
	ownership: ProjectOwnership,
	actorAccountId: string
): Promise<void> {
	const { data, error } = await supabase
		.from('projects')
		.update({
			client_id: ownership.clientId,
			repository_url: ownership.repositoryUrl,
			environment_url: ownership.environmentUrl
		})
		.eq('id', projectId)
		.select('name')
		.single();
	if (error) throw error;
	if (ownership.clientId === null) return;
	await recordClientEvent(
		supabase,
		ownership.clientId,
		'project_assigned',
		{ projectId, projectName: data.name },
		actorAccountId
	);
}
