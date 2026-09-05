import { formatBritishDate } from '$lib/data/britishDate';
import { formatMoney, roundToPence } from '$lib/data/accounting/money';
import { invoiceStatusLabels, isInvoiceOutstanding } from '$lib/data/accounting/invoiceStatus';
import { describeInvoiceLines } from './describeInvoiceLines';
import type { CostCentre } from '$lib/server/accounting/getCostCentres';
import type { InvoiceDetail, InvoicePayment } from '$lib/server/accounting/getInvoice';
import type { InvoiceSummary } from '$lib/server/accounting/getInvoiceList';
import type { LedgerAccount } from '$lib/server/accounting/getLedgerAccounts';

export const noSuchInvoice = 'No invoice has that id. Call list_invoices to see them.';

export function outstandingOn(invoice: { total: number; amountPaid: number }): number {
	return roundToPence(invoice.total - invoice.amountPaid);
}

export function describeInvoiceSummary(invoice: InvoiceSummary): string {
	const heading = `#${invoice.invoiceNumber} ${invoice.clientName} — ${invoiceStatusLabels[invoice.status]}`;
	const due = `due ${formatBritishDate(invoice.dueDate)}`;
	return `${heading} — ${due} — ${describeAmounts(invoice)} (id: ${invoice.id})`;
}

export function describeNotADraft(invoice: InvoiceDetail): string {
	const status = invoiceStatusLabels[invoice.status];
	return `Invoice #${invoice.invoiceNumber} is ${status} — only a draft can be edited.`;
}

export function describeInvoiceInFull(
	invoice: InvoiceDetail,
	accounts: LedgerAccount[],
	costCentres: CostCentre[]
): string {
	const status = invoiceStatusLabels[invoice.status];
	const money = `Total ${formatMoney(invoice.total)}, paid ${formatMoney(invoice.amountPaid)}`;
	return [
		`Invoice #${invoice.invoiceNumber} — ${invoice.client.name} — ${status} (id: ${invoice.id})`,
		`Issued ${formatBritishDate(invoice.issueDate)}, due ${formatBritishDate(invoice.dueDate)}`,
		invoice.reference === '' ? null : `Reference: ${invoice.reference}`,
		`${money}, outstanding ${formatMoney(outstandingOn(invoice))}`,
		'',
		'Lines:',
		...describeInvoiceLines(invoice.lines, accounts, costCentres),
		'',
		'Payments:',
		...describePayments(invoice.payments),
		...describeNotes(invoice.notes)
	]
		.filter((line) => line !== null)
		.join('\n');
}

function describeAmounts(invoice: InvoiceSummary): string {
	if (!isInvoiceOutstanding(invoice.status)) return formatMoney(invoice.total);
	return `${formatMoney(invoice.total)}, ${formatMoney(outstandingOn(invoice))} outstanding`;
}

function describePayments(payments: InvoicePayment[]): string[] {
	if (payments.length === 0) return ['None yet.'];
	return payments.map(
		(payment) => `${formatMoney(payment.amount)} on ${formatBritishDate(payment.paidOn)}`
	);
}

function describeNotes(notes: string): string[] {
	if (notes === '') return [];
	return ['', `Notes: ${notes}`];
}
