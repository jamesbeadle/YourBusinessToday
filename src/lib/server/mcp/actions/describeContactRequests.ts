import { describeRequestThread } from './describeRequestThread';
import { featureRequestStatusLabels } from '$lib/data/featureRequests';
import { formatBritishDate } from '$lib/data/britishDate';
import type { ClientProject } from '$lib/server/clients/getClientProjects';
import type { ClientRequest } from '$lib/server/requests/getRequestsForClient';
import type { RequestComment } from '$lib/server/requests/getRequestComments';

export const notAContact = 'You are not signed in as a client contact, so you have no projects or requests of your own here.';
export const noSuchOwnRequest = 'No request of yours has that id.';

export function describeOwnProjects(projects: ClientProject[]): string {
	if (projects.length === 0) return 'No projects are recorded for your company yet.';
	return projects.map(describeProjectLine).join('\n');
}

function describeProjectLine(project: ClientProject): string {
	const awaiting =
		project.openRequestCount === 0
			? 'no open requests'
			: `${project.openRequestCount} request(s) awaiting triage`;
	return `${project.name} — id ${project.id} — ${awaiting}${describeRepository(project.repositoryUrl)}`;
}

function describeRepository(repositoryUrl: string): string {
	if (repositoryUrl === '') return '';
	return ` — ${repositoryUrl}`;
}

export function describeOwnRequests(requests: ClientRequest[]): string {
	if (requests.length === 0) return 'Your company has not raised any feature requests yet.';
	return requests.map(describeRequestLine).join('\n');
}

function describeRequestLine(featureRequest: ClientRequest): string {
	const standing = describeStanding(featureRequest);
	return `${featureRequest.reference} — ${featureRequest.title} — ${featureRequest.projectName} — ${standing}`;
}

function describeStanding(featureRequest: ClientRequest): string {
	if (featureRequest.isDelivered) return 'Delivered';
	return featureRequestStatusLabels[featureRequest.status];
}

export function describeOwnRequestInFull(
	featureRequest: ClientRequest,
	comments: RequestComment[]
): string {
	return [
		`${featureRequest.reference} — ${featureRequest.title}`,
		`Project: ${featureRequest.projectName}`,
		`Standing: ${describeStanding(featureRequest)}`,
		`Raised: ${formatBritishDate(featureRequest.createdAt)}`,
		'',
		featureRequest.body,
		describeAnswer(featureRequest.decisionNote),
		'',
		describeRequestThread(comments)
	]
		.filter((line) => line !== null)
		.join('\n');
}

function describeAnswer(decisionNote: string): string | null {
	if (decisionNote === '') return null;
	return `\nOur answer: ${decisionNote}`;
}
