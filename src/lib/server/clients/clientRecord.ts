import { parseClientStage, type ClientStage } from '$lib/data/clientLifecycle';

export type Client = {
	id: string;
	name: string;
	website: string;
	address: string;
	stage: ClientStage;
	ownerId: string | null;
	isArchived: boolean;
	createdAt: string;
};

export function parseClientRecord(row: Record<string, unknown>): Client {
	return {
		id: row.id as string,
		name: row.name as string,
		website: (row.website ?? '') as string,
		address: (row.address ?? '') as string,
		stage: parseClientStage(row.lifecycle_stage),
		ownerId: (row.owner_id ?? null) as string | null,
		isArchived: row.is_archived as boolean,
		createdAt: row.created_at as string
	};
}
