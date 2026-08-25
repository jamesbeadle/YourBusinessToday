import type { SupabaseClient } from '@supabase/supabase-js';
import { SystemAccountCodes } from '$lib/data/accounting/systemAccountCodes';
import { AccountingError } from './accountingErrors';
import { findSystemAccountId } from './findSystemAccount';
import { getInvoice, type InvoiceDetail } from './getInvoice';
import { creditLine, debitLine } from './journalLines';
import { postJournal } from './postJournal';

export async function issueInvoice(supabase: SupabaseClient, invoiceId: string): Promise<void> {
	const invoice = await requireDraftInvoice(supabase, invoiceId);
	const debtorsAccountId = await findSystemAccountId(supabase, SystemAccountCodes.TradeDebtors);
	const journalId = await postJournal(supabase, {
		journalDate: invoice.issueDate,
		description: `Invoice ${invoice.invoiceNumber} — ${invoice.client.name}`,
		kind: 'invoice',
		lines: [
			debitLine(debtorsAccountId, invoice.total),
			...invoice.lines.map((line) => creditLine(line.incomeAccountId, line.amount, line.costCentreId))
		]
	});
	const { error } = await supabase
		.from('invoices')
		.update({ status: 'issued', issued_journal_id: journalId })
		.eq('id', invoiceId);
	if (error) throw error;
}

async function requireDraftInvoice(supabase: SupabaseClient, invoiceId: string): Promise<InvoiceDetail> {
	const invoice = await getInvoice(supabase, invoiceId);
	if (invoice === null) throw new AccountingError('That invoice no longer exists.');
	if (invoice.status !== 'draft') throw new AccountingError('Only a draft invoice can be issued.');
	if (invoice.lines.length === 0) throw new AccountingError('Add at least one line before issuing.');
	if (invoice.total <= 0) throw new AccountingError('An invoice must total more than zero.');
	return invoice;
}
