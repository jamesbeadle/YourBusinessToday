import {
	featureRequestReference,
	parseFeatureRequestStatus,
	type FeatureRequestStatus
} from '$lib/data/featureRequests';

export type FeatureRequest = {
	id: string;
	reference: string;
	projectId: string;
	raisedByContactId: string;
	title: string;
	body: string;
	benefit: string;
	status: FeatureRequestStatus;
	decisionNote: string;
	taskId: string | null;
	createdAt: string;
};

export const featureRequestColumns =
	'id, request_number, project_id, raised_by_contact_id, title, body, benefit, status, decision_note, task_id, created_at';

export function parseFeatureRequestRecord(row: Record<string, unknown>): FeatureRequest {
	return {
		id: row.id as string,
		reference: featureRequestReference(row.request_number as number),
		projectId: row.project_id as string,
		raisedByContactId: row.raised_by_contact_id as string,
		title: row.title as string,
		body: row.body as string,
		benefit: row.benefit as string,
		status: parseFeatureRequestStatus(row.status),
		decisionNote: row.decision_note as string,
		taskId: (row.task_id ?? null) as string | null,
		createdAt: row.created_at as string
	};
}
