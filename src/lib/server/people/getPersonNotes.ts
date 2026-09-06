import type { SupabaseClient } from '@supabase/supabase-js';
import type { ContactNoteKind } from './addContactNote';

export type ContactNote = {
	id: string;
	contactId: string;
	authorId: string | null;
	kind: ContactNoteKind;
	body: string;
	createdAt: string;
};

export async function getContactNotes(
	supabase: SupabaseClient,
	contactIds: string[]
): Promise<ContactNote[]> {
	if (contactIds.length === 0) return [];
	const { data, error } = await supabase
		.from('contact_notes')
		.select('id, contact_id, author_id, kind, body, created_at')
		.in('contact_id', contactIds)
		.order('created_at', { ascending: false });
	if (error) throw error;
	return data.map((row: Record<string, unknown>) => ({
		id: row.id as string,
		contactId: row.contact_id as string,
		authorId: (row.author_id ?? null) as string | null,
		kind: row.kind as ContactNoteKind,
		body: row.body as string,
		createdAt: row.created_at as string
	}));
}
