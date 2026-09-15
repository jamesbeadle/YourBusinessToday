import type { SupabaseClient } from '@supabase/supabase-js';
import type { PushedDeploy } from './readPushEvent';

export type DeployRecord = { projectId: string; deliveryId: string; deploy: PushedDeploy };

/** Records one deploy, once: a redelivered webhook carries the same delivery id and changes nothing. */
export async function recordDeploy(supabase: SupabaseClient, record: DeployRecord): Promise<boolean> {
	const { data, error } = await supabase
		.from('project_deploys')
		.upsert(
			{
				project_id: record.projectId,
				delivery_id: record.deliveryId,
				commit_sha: record.deploy.commitSha,
				branch: record.deploy.branch,
				pushed_at: record.deploy.pushedAt
			},
			{ onConflict: 'project_id,delivery_id', ignoreDuplicates: true }
		)
		.select('id');
	if (error) throw error;
	return data.length > 0;
}
