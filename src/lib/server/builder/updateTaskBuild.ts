import type { SupabaseClient } from '@supabase/supabase-js';
import type { BuildStatus } from '$lib/data/buildStatus';

export type TaskBuildUpdate = {
	buildStatus?: BuildStatus;
	buildBrief?: string;
	pullRequestUrl?: string;
	buildSessionUrl?: string;
	hasMigration?: boolean;
};

export async function updateTaskBuild(
	supabase: SupabaseClient,
	taskId: string,
	update: TaskBuildUpdate
): Promise<void> {
	const { error } = await supabase
		.from('tasks')
		.update(columnsFrom(update))
		.eq('id', taskId);
	if (error) throw error;
}

function columnsFrom(update: TaskBuildUpdate): Record<string, unknown> {
	return {
		...(update.buildStatus === undefined ? {} : { build_status: update.buildStatus }),
		...(update.buildBrief === undefined ? {} : { build_brief: update.buildBrief }),
		...(update.pullRequestUrl === undefined ? {} : { pull_request_url: update.pullRequestUrl }),
		...(update.buildSessionUrl === undefined ? {} : { build_session_url: update.buildSessionUrl }),
		...(update.hasMigration === undefined ? {} : { has_migration: update.hasMigration })
	};
}
