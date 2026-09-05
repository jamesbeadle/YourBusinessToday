import type { SupabaseClient } from '@supabase/supabase-js';

export type NewContactLink = { label: string; url: string };

const acceptedProtocols = ['http:', 'https:'];

export function readNewContactLink(formData: FormData): NewContactLink | null {
	const label = String(formData.get('label') ?? '').trim();
	const url = String(formData.get('url') ?? '').trim();
	if (label === '' || !isWebAddress(url)) return null;
	return { label, url };
}

export async function addContactLink(
	supabase: SupabaseClient,
	contactId: string,
	link: NewContactLink
): Promise<void> {
	const { error } = await supabase
		.from('contact_links')
		.insert({ contact_id: contactId, label: link.label, url: link.url });
	if (error) throw error;
}

function isWebAddress(candidate: string): boolean {
	try {
		return acceptedProtocols.includes(new URL(candidate).protocol);
	} catch {
		return false;
	}
}
