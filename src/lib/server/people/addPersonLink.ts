import type { SupabaseClient } from '@supabase/supabase-js';

export type NewPersonLink = { label: string; url: string };

const acceptedProtocols = ['http:', 'https:'];

export function readNewPersonLink(formData: FormData): NewPersonLink | null {
	const label = String(formData.get('label') ?? '').trim();
	const url = String(formData.get('url') ?? '').trim();
	if (label === '' || !isWebAddress(url)) return null;
	return { label, url };
}

export async function addPersonLink(
	supabase: SupabaseClient,
	personId: string,
	link: NewPersonLink
): Promise<void> {
	const { error } = await supabase
		.from('person_links')
		.insert({ person_id: personId, label: link.label, url: link.url });
	if (error) throw error;
}

function isWebAddress(candidate: string): boolean {
	try {
		return acceptedProtocols.includes(new URL(candidate).protocol);
	} catch {
		return false;
	}
}
