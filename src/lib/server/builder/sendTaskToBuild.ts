import { addTaskComment } from '$lib/server/projects/addTaskComment';
import { builderRoutineFor } from './builderRoutines';
import { builderTierFor, builderTierLabels, type BuilderTier } from '$lib/data/builderTier';
import { canSendToBuild, sendRefusalSentences } from './canSendToBuild';
import { fireBuilderRoutine } from './fireBuilderRoutine';
import { recordClientEvent } from '$lib/server/clients/recordClientEvent';
import { updateTaskBuild } from './updateTaskBuild';
import type { Project } from '$lib/server/projects/projectRecord';
import type { ProjectTask } from '$lib/server/projects/taskRecord';
import type { SupabaseClient } from '@supabase/supabase-js';

export type SendOutcome =
	| { kind: 'sent'; sessionUrl: string }
	| { kind: 'refused'; sentence: string };

export async function sendTaskToBuild(
	supabase: SupabaseClient,
	task: ProjectTask,
	project: Project,
	actorAccountId: string
): Promise<SendOutcome> {
	const refusal = canSendToBuild(task, project);
	if (refusal !== null) return { kind: 'refused', sentence: sendRefusalSentences[refusal] };
	const tier = builderTierFor(task.storyPoints);
	const routine = builderRoutineFor(tier);
	if (routine === null) return { kind: 'refused', sentence: noRoutineSentence(tier) };
	await updateTaskBuild(supabase, task.id, {
		buildStatus: 'queued',
		pullRequestUrl: '',
		buildSessionUrl: '',
		hasMigration: false
	});
	try {
		const fired = await fireBuilderRoutine(routine, task.id);
		await updateTaskBuild(supabase, task.id, { buildSessionUrl: fired.sessionUrl });
		await recordDispatch(supabase, task, project, tier, actorAccountId);
		return { kind: 'sent', sessionUrl: fired.sessionUrl };
	} catch (failure) {
		return recordFireFailure(supabase, task, failure, actorAccountId);
	}
}

function noRoutineSentence(tier: BuilderTier): string {
	return `No Builder is configured for ${builderTierLabels[tier].toLowerCase()} tasks yet.`;
}

async function recordDispatch(
	supabase: SupabaseClient,
	task: ProjectTask,
	project: Project,
	tier: BuilderTier,
	actorAccountId: string
): Promise<void> {
	if (project.clientId === null) return;
	await recordClientEvent(
		supabase,
		project.clientId,
		'build_dispatched',
		{ taskId: task.id, title: task.title, tier },
		actorAccountId
	);
}

async function recordFireFailure(
	supabase: SupabaseClient,
	task: ProjectTask,
	failure: unknown,
	actorAccountId: string
): Promise<SendOutcome> {
	const reason = failure instanceof Error ? failure.message : 'The routine could not be reached.';
	await updateTaskBuild(supabase, task.id, { buildStatus: 'not_sent' });
	await addTaskComment(supabase, task.id, actorAccountId, `Could not send to build: ${reason}`);
	return { kind: 'refused', sentence: `Not sent. ${reason}` };
}
