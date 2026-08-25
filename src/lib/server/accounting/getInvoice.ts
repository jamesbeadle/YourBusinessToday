import type { SupabaseClient } from '@supabase/supabase-js';
import type { InvoiceStatus } from '$lib/data/accounting/invoiceStatus';
import { roundToPence, sumMoney } from '$lib/data/accounting/money';
import { toClient, type Client } from './getClients';
import { readMoney } from './readNumeric';

export type InvoiceLine = {
	id: string;
	description: string;
	quantity: number;
	unitPrice: number;
	amount: number;
	incomeAccountId: string;
	costCentreId: string | null;
};

export type InvoicePayment = { id: string; paidOn: string; amount: number };

export type InvoiceDetail = {
	id: string;
	invoiceNumber: number;
	status: InvoiceStatus;
	issueDate: string;
	dueDate: string;
	reference: string;
	notes: string;
	issuedJournalId: string | null;
	client: Client;
	lines: InvoiceLine[];
	payments: InvoicePayment[];
	total: number;
	amountPaid: number;
};

const invoiceDetailColumns = '*, clients (*), invoice_lines (*), invoice_payments (*)';

export async function getInvoice(supabase: SupabaseClient, invoiceId: string): Promise<InvoiceDetail | null> {
	const { data, error } = await supabase
		.from('invoices')
		.select(invoiceDetailColumns)
		.eq('id', invoiceId)
		.maybeSingle();
	if (error) throw error;
	if (data === null) return null;
	const lines = sortedByPosition(data.invoice_lines).map(toInvoiceLine);
	const payments = sortedByPaidOn(data.invoice_payments).map(toInvoicePayment);
	return {
		id: data.id,
		invoiceNumber: data.invoice_number,
		status: data.status,
		issueDate: data.issue_date,
		dueDate: data.due_date,
		reference: data.reference,
		notes: data.notes,
		issuedJournalId: data.issued_journal_id,
		client: toClient(data.clients),
		lines,
		payments,
		total: sumMoney(lines.map((line) => line.amount)),
		amountPaid: sumMoney(payments.map((payment) => payment.amount))
	};
}

function toInvoiceLine(row: Record<string, any>): InvoiceLine {
	const quantity = readMoney(row.quantity);
	const unitPrice = readMoney(row.unit_price);
	return {
		id: row.id,
		description: row.description,
		quantity,
		unitPrice,
		amount: roundToPence(quantity * unitPrice),
		incomeAccountId: row.income_account_id,
		costCentreId: row.cost_centre_id
	};
}

function toInvoicePayment(row: Record<string, any>): InvoicePayment {
	return { id: row.id, paidOn: row.paid_on, amount: readMoney(row.amount) };
}

function sortedByPosition(rows: Record<string, any>[]): Record<string, any>[] {
	return [...rows].sort((first, second) => first.position - second.position);
}

function sortedByPaidOn(rows: Record<string, any>[]): Record<string, any>[] {
	return [...rows].sort((first, second) => first.paid_on.localeCompare(second.paid_on));
}
