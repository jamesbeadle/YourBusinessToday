import { addTaskComment } from '$lib/server/projects/addTaskComment';
import { isBuildInFlight } from '$lib/data/buildStatus';
import { updateTaskBuild } from './updateTaskBuild';
import type { ProjectTask } from '$lib/server/projects/taskRecord';
import type { SupabaseClient } from '@supabase/supabase-js';

export type BuildReport = {
	outcome: 'in_review' | 'failed';
	pullRequestUrl: string;
	hasMigration: boolean;
	note: string;
};

export type ReportOutcome = 'recorded' | 'not_building';

export async function reportBuild(
	supabase: SupabaseClient,
	task: ProjectTask,
	report: BuildReport,
	authorAccountId: string
): Promise<ReportOutcome> {
	if (!isBuildInFlight(task.buildStatus)) return 'not_building';
	await updateTaskBuild(supabase, task.id, {
		buildStatus: report.outcome,
		pullRequestUrl: report.pullRequestUrl,
		hasMigration: report.hasMigration
	});
	await addTaskComment(supabase, task.id, authorAccountId, commentFor(report));
	return 'recorded';
}

function commentFor(report: BuildReport): string {
	const opening = report.outcome === 'failed' ? 'Build failed' : 'Build ready for review';
	const migration = report.hasMigration ? ' It includes a migration; apply it before merging.' : '';
	return `${opening}: ${report.note}${migration}`;
}
