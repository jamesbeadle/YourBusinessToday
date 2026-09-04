import { featureRequestReference } from '$lib/data/featureRequests';
import { recordClientEvent } from '$lib/server/clients/recordClientEvent';
import type { ClientContact } from '$lib/server/clients/clientContactRecord';
import type { SupabaseClient } from '@supabase/supabase-js';

export type RaiseRequestSeed = {
	projectId: string;
	title: string;
	want: string;
	benefit: string;
};

export type RaiseResult =
	| { outcome: 'raised' | 'already_open'; requestId: string; reference: string }
	| { outcome: 'not_your_project' };

export async function raiseFeatureRequest(
	supabase: SupabaseClient,
	contact: ClientContact,
	seed: RaiseRequestSeed
): Promise<RaiseResult> {
	const isTheirs = await isProjectTheirs(supabase, seed.projectId, contact.clientId);
	if (!isTheirs) return { outcome: 'not_your_project' };
	const openTwin = await findOpenRequestByTitle(supabase, contact.id, seed);
	if (openTwin !== null) return { outcome: 'already_open', ...openTwin };
	const raised = await insertRequest(supabase, contact.id, seed);
	await recordClientEvent(
		supabase,
		contact.clientId,
		'request_raised',
		{ reference: raised.reference, title: seed.title },
		contact.accountId
	);
	return { outcome: 'raised', ...raised };
}

async function isProjectTheirs(
	supabase: SupabaseClient,
	projectId: string,
	clientId: string
): Promise<boolean> {
	const { data, error } = await supabase
		.from('projects')
		.select('client_id')
		.eq('id', projectId)
		.maybeSingle();
	if (error) throw error;
	return data !== null && data.client_id === clientId;
}

type RaisedRequest = { requestId: string; reference: string };

async function findOpenRequestByTitle(
	supabase: SupabaseClient,
	contactId: string,
	seed: RaiseRequestSeed
): Promise<RaisedRequest | null> {
	const { data, error } = await supabase
		.from('feature_requests')
		.select('id, request_number')
		.eq('raised_by_contact_id', contactId)
		.eq('project_id', seed.projectId)
		.eq('status', 'new')
		.ilike('title', seed.title)
		.maybeSingle();
	if (error) throw error;
	if (data === null) return null;
	return { requestId: data.id, reference: featureRequestReference(data.request_number) };
}

async function insertRequest(
	supabase: SupabaseClient,
	contactId: string,
	seed: RaiseRequestSeed
): Promise<RaisedRequest> {
	const { data, error } = await supabase
		.from('feature_requests')
		.insert({
			project_id: seed.projectId,
			raised_by_contact_id: contactId,
			title: seed.title,
			body: seed.want,
			benefit: seed.benefit
		})
		.select('id, request_number')
		.single();
	if (error) throw error;
	return { requestId: data.id, reference: featureRequestReference(data.request_number) };
}
