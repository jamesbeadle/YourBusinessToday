import type { SupabaseClient } from '@supabase/supabase-js';
import { recordClientEvent } from './recordClientEvent';

export type NewClientSeed = {
	name: string;
	website: string;
	ownerId: string;
};

export function readNewClientSeed(formData: FormData, fallbackOwnerId: string): NewClientSeed | null {
	const name = String(formData.get('name') ?? '').trim();
	if (name === '') return null;
	const requestedOwnerId = String(formData.get('ownerId') ?? '');
	return {
		name,
		website: String(formData.get('website') ?? '').trim(),
		ownerId: requestedOwnerId === '' ? fallbackOwnerId : requestedOwnerId
	};
}

export async function createClient(
	supabase: SupabaseClient,
	seed: NewClientSeed,
	actorAccountId: string
): Promise<string> {
	const { data, error } = await supabase
		.from('clients')
		.insert({ name: seed.name, website: seed.website, owner_id: seed.ownerId })
		.select('id')
		.single();
	if (error) throw error;
	await recordClientEvent(supabase, data.id, 'stage_moved', { to: 'lead' }, actorAccountId);
	return data.id;
}
