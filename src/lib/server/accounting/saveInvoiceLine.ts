import type { SupabaseClient } from '@supabase/supabase-js';

export type InvoiceLineInput = {
	description: string;
	quantity: number;
	unitPrice: number;
	incomeAccountId: string;
	costCentreId: string | null;
};

export async function addInvoiceLine(
	supabase: SupabaseClient,
	invoiceId: string,
	line: InvoiceLineInput
): Promise<void> {
	const position = await nextLinePosition(supabase, invoiceId);
	const { error } = await supabase
		.from('invoice_lines')
		.insert({ invoice_id: invoiceId, position, ...toLineRow(line) });
	if (error) throw error;
}

export async function updateInvoiceLine(
	supabase: SupabaseClient,
	lineId: string,
	line: InvoiceLineInput
): Promise<void> {
	const { error } = await supabase.from('invoice_lines').update(toLineRow(line)).eq('id', lineId);
	if (error) throw error;
}

export async function deleteInvoiceLine(supabase: SupabaseClient, lineId: string): Promise<void> {
	const { error } = await supabase.from('invoice_lines').delete().eq('id', lineId);
	if (error) throw error;
}

async function nextLinePosition(supabase: SupabaseClient, invoiceId: string): Promise<number> {
	const { count, error } = await supabase
		.from('invoice_lines')
		.select('id', { count: 'exact', head: true })
		.eq('invoice_id', invoiceId);
	if (error) throw error;
	return count ?? 0;
}

function toLineRow(line: InvoiceLineInput) {
	return {
		description: line.description,
		quantity: line.quantity,
		unit_price: line.unitPrice,
		income_account_id: line.incomeAccountId,
		cost_centre_id: line.costCentreId
	};
}
