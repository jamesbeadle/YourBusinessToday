import type { SupabaseClient } from '@supabase/supabase-js';
import type { ClientStage } from '$lib/data/clientLifecycle';
import { parseClientRecord, type Client } from './clientRecord';

export type ClientSummary = Client & {
	primaryContactName: string;
	projectCount: number;
	openRequestCount: number;
};

export async function getClientList(
	supabase: SupabaseClient,
	stage: ClientStage | null = null
): Promise<ClientSummary[]> {
	const query = supabase
		.from('clients')
		.select('*, client_contacts(is_primary, people(name)), projects(id, feature_requests(status))')
		.order('name');
	const { data, error } = stage === null ? await query : await query.eq('lifecycle_stage', stage);
	if (error) throw error;
	return data.map(toSummary);
}

type ProjectRow = { feature_requests: { status: string }[] };
type ContactRow = { is_primary: boolean; people: { name: string } | null };

function toSummary(row: Record<string, unknown>): ClientSummary {
	const projects = (row.projects ?? []) as ProjectRow[];
	return {
		...parseClientRecord(row),
		primaryContactName: primaryContactName((row.client_contacts ?? []) as ContactRow[]),
		projectCount: projects.length,
		openRequestCount: countAwaitingTriage(projects)
	};
}

function primaryContactName(contacts: ContactRow[]): string {
	const primary = contacts.find((contact) => contact.is_primary) ?? contacts[0];
	if (primary === undefined) return '';
	return primary.people?.name ?? '';
}

function countAwaitingTriage(projects: ProjectRow[]): number {
	return projects
		.flatMap((project) => project.feature_requests)
		.filter((request) => request.status === 'new').length;
}
