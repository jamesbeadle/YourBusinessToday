import { canEditInvoice } from '$lib/data/accounting/invoiceStatus';
import { describeNotADraft, noSuchInvoice } from './describeInvoice';
import { getInvoice } from '$lib/server/accounting/getInvoice';
import type { InvoiceDetail } from '$lib/server/accounting/getInvoice';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function resolveDraftInvoice(
	supabase: SupabaseClient,
	invoiceId: string
): Promise<InvoiceDetail | string> {
	const invoice = await getInvoice(supabase, invoiceId);
	if (invoice === null) return noSuchInvoice;
	if (!canEditInvoice(invoice.status)) return describeNotADraft(invoice);
	return invoice;
}

export function isRefusal(resolved: InvoiceDetail | string): resolved is string {
	return typeof resolved === 'string';
}
