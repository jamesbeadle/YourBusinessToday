import { redirect } from '@sveltejs/kit';
import { failFromAccountingError } from '$lib/server/accounting/accountingErrors';
import { createInvoice } from '$lib/server/accounting/createInvoice';
import { getAccountingSettings } from '$lib/server/accounting/getAccountingSettings';
import { activeClients, getClients } from '$lib/server/accounting/getClients';
import { getInvoiceList } from '$lib/server/accounting/getInvoiceList';
import { readInvoiceDetailsForm } from '$lib/server/accounting/readInvoiceForms';
import { requireAdmin } from '$lib/server/admin/requireAdmin';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const settings = await getAccountingSettings(locals.supabase);
	return {
		invoices: await getInvoiceList(locals.supabase),
		clients: activeClients(await getClients(locals.supabase)),
		paymentTermsDays: settings.paymentTermsDays,
		shouldOpenNewInvoice: url.searchParams.has('new'),
		preselectedClientId: url.searchParams.get('clientId') ?? ''
	};
};

export const actions: Actions = {
	createInvoice: async ({ locals, request }) => {
		await requireAdmin(locals);
		let invoiceId: string;
		try {
			invoiceId = await createInvoice(locals.supabase, readInvoiceDetailsForm(await request.formData()));
		} catch (error) {
			return failFromAccountingError(error);
		}
		redirect(303, `/accounting/invoices/${invoiceId}`);
	}
};
