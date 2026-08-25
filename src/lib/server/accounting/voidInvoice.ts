import type { SupabaseClient } from '@supabase/supabase-js';
import { toIsoDate } from '$lib/data/accounting/accountingPeriods';
import { AccountingError } from './accountingErrors';
import { getInvoice, type InvoiceDetail } from './getInvoice';
import { getJournalLines } from './getJournalLines';
import { reversedLines } from './journalLines';
import { postJournal } from './postJournal';

export async function voidInvoice(supabase: SupabaseClient, invoiceId: string): Promise<void> {
	const invoice = await getInvoice(supabase, invoiceId);
	if (invoice === null) throw new AccountingError('That invoice no longer exists.');
	if (invoice.payments.length > 0) {
		throw new AccountingError('An invoice with payments recorded cannot be voided.');
	}
	if (invoice.status === 'void') return;
	if (invoice.issuedJournalId !== null) await reverseIssuedJournal(supabase, invoice);
	const { error } = await supabase.from('invoices').update({ status: 'void' }).eq('id', invoiceId);
	if (error) throw error;
}

async function reverseIssuedJournal(supabase: SupabaseClient, invoice: InvoiceDetail): Promise<void> {
	const issuedJournalId = invoice.issuedJournalId as string;
	await postJournal(supabase, {
		journalDate: toIsoDate(new Date()),
		description: `Void invoice ${invoice.invoiceNumber} — ${invoice.client.name}`,
		kind: 'invoice_void',
		reversesJournalId: issuedJournalId,
		lines: reversedLines(await getJournalLines(supabase, issuedJournalId))
	});
}
