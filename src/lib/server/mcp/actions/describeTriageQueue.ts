import { describeRequestThread } from './describeRequestThread';
import { featureRequestStatusLabels } from '$lib/data/featureRequests';
import { formatBritishDate } from '$lib/data/britishDate';
import type { QueuedRequest } from '$lib/server/requests/getTriageQueue';
import type { RequestComment } from '$lib/server/requests/getRequestComments';
import type { RequestDetail } from '$lib/server/requests/getFeatureRequest';

export const noSuchRequest = 'No request has that id or reference. Call list_triage_queue to see them.';

export function describeTriageQueue(requests: QueuedRequest[]): string {
	if (requests.length === 0) return 'Nothing is in the queue.';
	return requests.map(describeQueuedLine).join('\n');
}

function describeQueuedLine(featureRequest: QueuedRequest): string {
	return [
		`${featureRequest.reference} — ${featureRequest.title}`,
		`${featureRequest.clientName} on ${featureRequest.projectName}`,
		`raised by ${featureRequest.raisedByName} on ${formatBritishDate(featureRequest.createdAt)}`,
		featureRequestStatusLabels[featureRequest.status],
		`id ${featureRequest.id}`
	].join(' — ');
}

export function describeRequestForStaff(
	featureRequest: RequestDetail,
	comments: RequestComment[]
): string {
	return [
		`${featureRequest.reference} — ${featureRequest.title}`,
		`${featureRequest.clientName} on ${featureRequest.projectName} — id ${featureRequest.id}`,
		`Raised by ${featureRequest.raisedByName} on ${formatBritishDate(featureRequest.createdAt)}`,
		`Standing: ${describeStaffStanding(featureRequest)}`,
		'',
		featureRequest.body,
		featureRequest.benefit === '' ? null : `So that: ${featureRequest.benefit}`,
		featureRequest.decisionNote === '' ? null : `\nAnswer given: ${featureRequest.decisionNote}`,
		'',
		describeRequestThread(comments)
	]
		.filter((line) => line !== null)
		.join('\n');
}

function describeStaffStanding(featureRequest: RequestDetail): string {
	const status = featureRequestStatusLabels[featureRequest.status];
	if (featureRequest.isDelivered) return `Delivered — task id ${featureRequest.taskId}`;
	if (featureRequest.taskId === null) return status;
	return `${status}, promoted to task id ${featureRequest.taskId}`;
}
