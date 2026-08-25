import type { SupabaseClient } from '@supabase/supabase-js';

export type Client = {
	id: string;
	name: string;
	contactName: string;
	email: string;
	address: string;
	isArchived: boolean;
};

export async function getClients(supabase: SupabaseClient): Promise<Client[]> {
	const { data, error } = await supabase.from('clients').select('*').order('name');
	if (error) throw error;
	return data.map(toClient);
}

export async function getClient(supabase: SupabaseClient, clientId: string): Promise<Client | null> {
	const { data, error } = await supabase.from('clients').select('*').eq('id', clientId).maybeSingle();
	if (error) throw error;
	return data === null ? null : toClient(data);
}

export function activeClients(clients: Client[]): Client[] {
	return clients.filter((client) => !client.isArchived);
}

export function toClient(row: Record<string, unknown>): Client {
	return {
		id: row.id as string,
		name: row.name as string,
		contactName: row.contact_name as string,
		email: row.email as string,
		address: row.address as string,
		isArchived: row.is_archived as boolean
	};
}
