import type { SupabaseClient } from '@supabase/supabase-js';
import { canDeleteInvoice } from '$lib/data/accounting/invoiceStatus';
import { AccountingError } from './accountingErrors';
import { getInvoice } from './getInvoice';

export async function deleteInvoice(supabase: SupabaseClient, invoiceId: string): Promise<void> {
	const invoice = await getInvoice(supabase, invoiceId);
	if (invoice === null) return;
	if (!canDeleteInvoice(invoice.status)) {
		throw new AccountingError('An issued invoice cannot be deleted — void it first.');
	}
	const { error } = await supabase.from('invoices').delete().eq('id', invoiceId);
	if (error) throw error;
}
