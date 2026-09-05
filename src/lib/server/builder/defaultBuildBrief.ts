import type { RequestDetail } from '$lib/server/requests/getFeatureRequest';

export function defaultBuildBriefFor(request: RequestDetail, contactRole: string): string {
	const role = contactRole.trim() === '' ? 'client' : contactRole.trim();
	const benefit = request.benefit === '' ? '' : `, so that ${request.benefit}`;
	return [
		`As a ${role} at ${request.clientName}, I want ${request.title}${benefit}.`,
		'',
		'In their words:',
		request.body
	].join('\n');
}
