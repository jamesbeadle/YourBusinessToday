import type { SupabaseClient } from '@supabase/supabase-js';
import { SystemAccountCodes } from '$lib/data/accounting/systemAccountCodes';
import { roundToPence } from '$lib/data/accounting/money';
import { AccountingError } from './accountingErrors';
import { findSystemAccountId } from './findSystemAccount';
import { getInvoice } from './getInvoice';
import { creditLine, debitLine } from './journalLines';
import { postJournal } from './postJournal';

export async function recordInvoicePayment(
	supabase: SupabaseClient,
	payment: { invoiceId: string; paidOn: string; amount: number }
): Promise<void> {
	const invoice = await getInvoice(supabase, payment.invoiceId);
	if (invoice === null) throw new AccountingError('That invoice no longer exists.');
	if (invoice.status !== 'issued') throw new AccountingError('Only an issued invoice can be paid.');
	const outstanding = roundToPence(invoice.total - invoice.amountPaid);
	if (payment.amount > outstanding) {
		throw new AccountingError(`Only ${outstanding} is outstanding on this invoice.`);
	}
	const journalId = await postJournal(supabase, {
		journalDate: payment.paidOn,
		description: `Payment for invoice ${invoice.invoiceNumber} — ${invoice.client.name}`,
		kind: 'invoice_payment',
		lines: [
			debitLine(await findSystemAccountId(supabase, SystemAccountCodes.Bank), payment.amount),
			creditLine(await findSystemAccountId(supabase, SystemAccountCodes.TradeDebtors), payment.amount)
		]
	});
	await insertPayment(supabase, payment, journalId);
	if (payment.amount === outstanding) await markInvoicePaid(supabase, payment.invoiceId);
}

async function insertPayment(
	supabase: SupabaseClient,
	payment: { invoiceId: string; paidOn: string; amount: number },
	journalId: string
): Promise<void> {
	const { error } = await supabase.from('invoice_payments').insert({
		invoice_id: payment.invoiceId,
		paid_on: payment.paidOn,
		amount: payment.amount,
		journal_id: journalId
	});
	if (error) throw error;
}

async function markInvoicePaid(supabase: SupabaseClient, invoiceId: string): Promise<void> {
	const { error } = await supabase.from('invoices').update({ status: 'paid' }).eq('id', invoiceId);
	if (error) throw error;
}
