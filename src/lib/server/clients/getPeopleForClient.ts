import type { SupabaseClient } from '@supabase/supabase-js';
import { getClientContacts } from './getClientContacts';
import { getContactLinks, type ContactLink } from './getContactLinks';
import { getContactNotes, type ContactNote } from './getContactNotes';
import { getStaffDirectory } from '$lib/server/projects/getStaffDirectory';
import type { ClientContact } from './clientContactRecord';

export type AuthoredNote = ContactNote & { authorName: string };

export type Person = ClientContact & {
	links: ContactLink[];
	notes: AuthoredNote[];
};

const unknownAuthor = 'Someone';

export async function getPeopleForClient(
	supabase: SupabaseClient,
	clientId: string
): Promise<Person[]> {
	const contacts = await getClientContacts(supabase, clientId);
	const contactIds = contacts.map((contact) => contact.id);
	const [links, notes, staffMembers] = await Promise.all([
		getContactLinks(supabase, contactIds),
		getContactNotes(supabase, contactIds),
		getStaffDirectory(supabase)
	]);
	const authorNames = new Map(staffMembers.map((member) => [member.id, member.name]));
	return contacts.map((contact) => ({
		...contact,
		links: links.filter((link) => link.contactId === contact.id),
		notes: notes
			.filter((note) => note.contactId === contact.id)
			.map((note) => ({ ...note, authorName: authorNameFor(note, authorNames) }))
	}));
}

function authorNameFor(note: ContactNote, authorNames: Map<string, string>): string {
	if (note.authorId === null) return unknownAuthor;
	return authorNames.get(note.authorId) ?? unknownAuthor;
}
