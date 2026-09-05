import type { SupabaseClient } from '@supabase/supabase-js';
import { recordClientEvent } from './recordClientEvent';

export type NewContactSeed = {
	name: string;
	email: string;
	phone: string;
	role: string;
	isPrimary: boolean;
	sourceUrl?: string;
};

export type AddContactOutcome = 'added' | 'already_known';

const duplicateRowCode = '23505';

export function readNewContactSeed(formData: FormData): NewContactSeed | null {
	const name = String(formData.get('name') ?? '').trim();
	if (name === '') return null;
	return {
		name,
		email: String(formData.get('email') ?? '').trim().toLowerCase(),
		phone: String(formData.get('phone') ?? '').trim(),
		role: String(formData.get('role') ?? '').trim(),
		isPrimary: formData.get('isPrimary') === 'on'
	};
}

export async function addClientContact(
	supabase: SupabaseClient,
	clientId: string,
	seed: NewContactSeed,
	actorAccountId: string
): Promise<AddContactOutcome> {
	if (seed.isPrimary) await standDownExistingPrimary(supabase, clientId);
	const { error } = await supabase.from('client_contacts').insert({
		client_id: clientId,
		name: seed.name,
		email: seed.email,
		phone: seed.phone,
		role: seed.role,
		is_primary: seed.isPrimary,
		source_url: seed.sourceUrl ?? ''
	});
	if (error !== null && error.code === duplicateRowCode) return 'already_known';
	if (error !== null) throw error;
	await recordClientEvent(supabase, clientId, 'contact_added', { name: seed.name, email: seed.email }, actorAccountId);
	return 'added';
}

async function standDownExistingPrimary(
	supabase: SupabaseClient,
	clientId: string
): Promise<void> {
	const { error } = await supabase
		.from('client_contacts')
		.update({ is_primary: false })
		.eq('client_id', clientId)
		.eq('is_primary', true);
	if (error) throw error;
}
