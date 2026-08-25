import { error } from '@sveltejs/kit';
import { getAccountingSettings } from '$lib/server/accounting/getAccountingSettings';
import { getInvoice } from '$lib/server/accounting/getInvoice';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const invoice = await getInvoice(locals.supabase, params.invoiceId);
	if (invoice === null) error(404, 'No such invoice');
	return { invoice, settings: await getAccountingSettings(locals.supabase) };
};
