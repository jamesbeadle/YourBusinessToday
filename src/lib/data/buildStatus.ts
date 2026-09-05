export type BuildStatus = 'not_sent' | 'queued' | 'building' | 'in_review' | 'live' | 'failed';

export const buildStatusLabels: Record<BuildStatus, string> = {
	not_sent: 'Not sent',
	queued: 'Queued',
	building: 'Building',
	in_review: 'In review',
	live: 'Live',
	failed: 'Failed'
};

const knownBuildStatuses: BuildStatus[] = [
	'not_sent',
	'queued',
	'building',
	'in_review',
	'live',
	'failed'
];

export function parseBuildStatus(value: unknown): BuildStatus {
	if (knownBuildStatuses.includes(value as BuildStatus)) return value as BuildStatus;
	return 'not_sent';
}

export function isBuildInFlight(status: BuildStatus): boolean {
	return status === 'queued' || status === 'building';
}
