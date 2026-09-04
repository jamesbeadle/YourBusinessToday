import { redirect } from '@sveltejs/kit';
import { requireUser } from './requireUser';
import { resolveContactForAccount } from '$lib/server/clients/resolveContactForAccount';
import type { ClientContact } from '$lib/server/clients/clientContactRecord';

export async function requireClientContact(locals: App.Locals): Promise<ClientContact> {
	const user = await requireUser(locals);
	const contact = await resolveContactForAccount(locals.supabase, user.id);
	if (contact === null) redirect(303, '/');
	return contact;
}
