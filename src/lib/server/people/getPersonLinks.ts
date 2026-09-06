import type { SupabaseClient } from '@supabase/supabase-js';

export type ContactLink = {
	id: string;
	contactId: string;
	label: string;
	url: string;
};

export async function getContactLinks(
	supabase: SupabaseClient,
	contactIds: string[]
): Promise<ContactLink[]> {
	if (contactIds.length === 0) return [];
	const { data, error } = await supabase
		.from('contact_links')
		.select('id, contact_id, label, url')
		.in('contact_id', contactIds)
		.order('created_at');
	if (error) throw error;
	return data.map((row: Record<string, unknown>) => ({
		id: row.id as string,
		contactId: row.contact_id as string,
		label: row.label as string,
		url: row.url as string
	}));
}
