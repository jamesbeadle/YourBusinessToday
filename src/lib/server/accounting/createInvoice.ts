import type { SupabaseClient } from '@supabase/supabase-js';

export type InvoiceDetailsInput = {
	clientId: string;
	issueDate: string;
	dueDate: string;
	reference: string;
	notes: string;
};

export async function createInvoice(
	supabase: SupabaseClient,
	details: InvoiceDetailsInput
): Promise<string> {
	const invoiceNumber = await allocateInvoiceNumber(supabase);
	const { data, error } = await supabase
		.from('invoices')
		.insert({ invoice_number: invoiceNumber, ...toInvoiceRow(details) })
		.select('id')
		.single();
	if (error) throw error;
	return data.id;
}

export async function updateInvoiceDetails(
	supabase: SupabaseClient,
	invoiceId: string,
	details: InvoiceDetailsInput
): Promise<void> {
	const { error } = await supabase
		.from('invoices')
		.update(toInvoiceRow(details))
		.eq('id', invoiceId)
		.eq('status', 'draft');
	if (error) throw error;
}

async function allocateInvoiceNumber(supabase: SupabaseClient): Promise<number> {
	const { data, error } = await supabase.rpc('allocate_invoice_number');
	if (error) throw error;
	return data as number;
}

function toInvoiceRow(details: InvoiceDetailsInput) {
	return {
		client_id: details.clientId,
		issue_date: details.issueDate,
		due_date: details.dueDate,
		reference: details.reference,
		notes: details.notes
	};
}
