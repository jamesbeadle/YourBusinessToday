import type { SupabaseClient } from '@supabase/supabase-js';

export type ClientInput = {
	name: string;
	contactName: string;
	email: string;
	address: string;
};

export async function createClient(supabase: SupabaseClient, client: ClientInput): Promise<string> {
	const { data, error } = await supabase
		.from('clients')
		.insert(toClientRow(client))
		.select('id')
		.single();
	if (error) throw error;
	return data.id;
}

export async function updateClient(
	supabase: SupabaseClient,
	clientId: string,
	client: ClientInput
): Promise<void> {
	const { error } = await supabase.from('clients').update(toClientRow(client)).eq('id', clientId);
	if (error) throw error;
}

export async function setClientArchived(
	supabase: SupabaseClient,
	clientId: string,
	isArchived: boolean
): Promise<void> {
	const { error } = await supabase
		.from('clients')
		.update({ is_archived: isArchived })
		.eq('id', clientId);
	if (error) throw error;
}

function toClientRow(client: ClientInput) {
	return {
		name: client.name,
		contact_name: client.contactName,
		email: client.email,
		address: client.address
	};
}
