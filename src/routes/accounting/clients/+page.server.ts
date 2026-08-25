import { redirect } from '@sveltejs/kit';
import { failFromAccountingError } from '$lib/server/accounting/accountingErrors';
import { getClients } from '$lib/server/accounting/getClients';
import { createClient } from '$lib/server/accounting/manageClients';
import { readClientForm } from '$lib/server/accounting/readClientForm';
import { requireAdmin } from '$lib/server/admin/requireAdmin';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	return { clients: await getClients(locals.supabase) };
};

export const actions: Actions = {
	createClient: async ({ locals, request }) => {
		await requireAdmin(locals);
		let clientId: string;
		try {
			clientId = await createClient(locals.supabase, readClientForm(await request.formData()));
		} catch (error) {
			return failFromAccountingError(error);
		}
		redirect(303, `/accounting/clients/${clientId}`);
	}
};
