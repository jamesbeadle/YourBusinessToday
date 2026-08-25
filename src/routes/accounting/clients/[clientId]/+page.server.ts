import { error, redirect } from '@sveltejs/kit';
import { getClient } from '$lib/server/accounting/getClients';
import { getInvoiceList } from '$lib/server/accounting/getInvoiceList';
import { setClientArchived, updateClient } from '$lib/server/accounting/manageClients';
import { readClientForm } from '$lib/server/accounting/readClientForm';
import { readIsChecked } from '$lib/server/accounting/readFormValues';
import { runAccountingCommand } from '$lib/server/accounting/runAccountingCommand';
import { requireAdmin } from '$lib/server/admin/requireAdmin';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const client = await getClient(locals.supabase, params.clientId);
	if (client === null) error(404, 'No such client');
	return { client, invoices: await getInvoiceList(locals.supabase, client.id) };
};

export const actions: Actions = {
	updateClient: async ({ locals, params, request }) => {
		const formData = await request.formData();
		return runAccountingCommand(
			locals,
			() => updateClient(locals.supabase, params.clientId, readClientForm(formData)),
			'Client details saved.'
		);
	},
	setArchived: async ({ locals, params, request }) => {
		await requireAdmin(locals);
		const isArchived = readIsChecked(await request.formData(), 'isArchived');
		await setClientArchived(locals.supabase, params.clientId, isArchived);
		redirect(303, '/accounting/clients');
	}
};
