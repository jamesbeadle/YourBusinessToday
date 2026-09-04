import type { ClientContact } from '$lib/server/clients/clientContactRecord';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getClientProjects, type ClientProject } from '$lib/server/clients/getClientProjects';
import { getRequestsForClient, type ClientRequest } from './getRequestsForClient';

export type ContactPortal = {
	projects: ClientProject[];
	requests: ClientRequest[];
};

export async function getContactPortal(
	supabase: SupabaseClient,
	contact: ClientContact
): Promise<ContactPortal> {
	return {
		projects: await getClientProjects(supabase, contact.clientId),
		requests: await getRequestsForClient(supabase, contact.clientId)
	};
}
