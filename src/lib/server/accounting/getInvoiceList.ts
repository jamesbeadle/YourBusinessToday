import type { SupabaseClient } from '@supabase/supabase-js';
import type { InvoiceStatus } from '$lib/data/accounting/invoiceStatus';
import { roundToPence, sumMoney } from '$lib/data/accounting/money';
import { readMoney } from './readNumeric';

export type InvoiceSummary = {
	id: string;
	invoiceNumber: number;
	clientName: string;
	status: InvoiceStatus;
	issueDate: string;
	dueDate: string;
	total: number;
	amountPaid: number;
};

const invoiceSummaryColumns =
	'id, invoice_number, status, issue_date, due_date, clients (name), invoice_lines (quantity, unit_price), invoice_payments (amount)';

export async function getInvoiceList(
	supabase: SupabaseClient,
	clientId: string | null = null
): Promise<InvoiceSummary[]> {
	const query = supabase.from('invoices').select(invoiceSummaryColumns);
	const scoped = clientId === null ? query : query.eq('client_id', clientId);
	const { data, error } = await scoped.order('invoice_number', { ascending: false });
	if (error) throw error;
	return data.map(toInvoiceSummary);
}

function toInvoiceSummary(row: Record<string, any>): InvoiceSummary {
	return {
		id: row.id,
		invoiceNumber: row.invoice_number,
		clientName: row.clients?.name ?? '',
		status: row.status,
		issueDate: row.issue_date,
		dueDate: row.due_date,
		total: totalOfLines(row.invoice_lines ?? []),
		amountPaid: sumMoney((row.invoice_payments ?? []).map((payment: any) => readMoney(payment.amount)))
	};
}

export function totalOfLines(lines: { quantity: unknown; unit_price: unknown }[]): number {
	return sumMoney(lines.map((line) => roundToPence(readMoney(line.quantity) * readMoney(line.unit_price))));
}
