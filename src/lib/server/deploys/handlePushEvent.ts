import type { SupabaseClient } from '@supabase/supabase-js';
import { findProjectsByRepository } from './findProjectsByRepository';
import { raiseRefactorRoundIfDue, type RoundOutcome } from '$lib/server/refactor/raiseRefactorRoundIfDue';
import { readPushEvent, type PushedDeploy } from './readPushEvent';
import { recordDeploy } from './recordDeploy';
import type { Project } from '$lib/server/projects/projectRecord';

export type PushOutcome =
	| { kind: 'ignored'; reason: 'not_a_branch_push' | 'no_project_for_repository' | 'not_the_default_branch' }
	| { kind: 'recorded'; projects: { projectId: string; isNew: boolean; round: RoundOutcome }[] };

/** A push to a project's default branch is a deploy: record it, then raise the refactor round if it is due. */
export async function handlePushEvent(
	supabase: SupabaseClient,
	event: unknown,
	deliveryId: string
): Promise<PushOutcome> {
	const deploy = readPushEvent(event, new Date());
	if (deploy === null) return { kind: 'ignored', reason: 'not_a_branch_push' };
	const projects = await findProjectsByRepository(supabase, deploy.repositoryUrl);
	if (projects.length === 0) return { kind: 'ignored', reason: 'no_project_for_repository' };
	const deployed = projects.filter((project) => project.defaultBranch === deploy.branch);
	if (deployed.length === 0) return { kind: 'ignored', reason: 'not_the_default_branch' };
	const outcomes = [];
	for (const project of deployed) outcomes.push(await recordAndRaise(supabase, project, deploy, deliveryId));
	return { kind: 'recorded', projects: outcomes };
}

async function recordAndRaise(
	supabase: SupabaseClient,
	project: Project,
	deploy: PushedDeploy,
	deliveryId: string
): Promise<{ projectId: string; isNew: boolean; round: RoundOutcome }> {
	const isNew = await recordDeploy(supabase, { projectId: project.id, deliveryId, deploy });
	const round = isNew ? await raiseRefactorRoundIfDue(supabase, project) : 'not_due';
	return { projectId: project.id, isNew, round };
}
