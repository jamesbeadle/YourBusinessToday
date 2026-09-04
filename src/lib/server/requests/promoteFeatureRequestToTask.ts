import { createTask } from '$lib/server/projects/createTask';
import { recordClientEvent } from '$lib/server/clients/recordClientEvent';
import { setTaskUserStory } from '$lib/server/projects/setTaskUserStory';
import type { RequestDetail } from './getFeatureRequest';
import type { SupabaseClient } from '@supabase/supabase-js';

const unstatedRole = 'client';

export async function promoteFeatureRequestToTask(
	supabase: SupabaseClient,
	request: RequestDetail,
	contactRole: string,
	createdBy: string
): Promise<string> {
	const taskId = await createTask(
		supabase,
		request.projectId,
		{
			title: request.title,
			details: detailsFrom(request),
			dueDate: null,
			phaseId: null,
			parentTaskId: null
		},
		createdBy
	);
	await setTaskUserStory(supabase, taskId, {
		role: storyRoleFor(request, contactRole),
		want: request.title,
		benefit: request.benefit
	});
	await linkRequestToTask(supabase, request.id, taskId);
	await recordClientEvent(
		supabase,
		request.clientId,
		'request_promoted',
		{ reference: request.reference, taskId },
		createdBy
	);
	return taskId;
}

function detailsFrom(request: RequestDetail): string {
	return `${request.body}\n\nRaised as ${request.reference} by ${request.raisedByName} (${request.clientName}).`;
}

function storyRoleFor(request: RequestDetail, contactRole: string): string {
	const role = contactRole.trim() === '' ? unstatedRole : contactRole.trim();
	return `${role} at ${request.clientName}`;
}

async function linkRequestToTask(
	supabase: SupabaseClient,
	requestId: string,
	taskId: string
): Promise<void> {
	const { error } = await supabase
		.from('feature_requests')
		.update({ task_id: taskId })
		.eq('id', requestId);
	if (error) throw error;
}
