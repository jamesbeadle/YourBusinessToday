import type { SupabaseClient } from '@supabase/supabase-js';

export type ContactNoteKind = 'note' | 'approach';

export async function addContactNote(
	supabase: SupabaseClient,
	contactId: string,
	kind: ContactNoteKind,
	body: string,
	authorId: string
): Promise<void> {
	const { error } = await supabase
		.from('contact_notes')
		.insert({ contact_id: contactId, kind, body, author_id: authorId });
	if (error) throw error;
}
