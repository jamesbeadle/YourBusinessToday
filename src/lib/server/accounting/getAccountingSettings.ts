import type { SupabaseClient } from '@supabase/supabase-js';

export type AccountingSettings = {
	companyName: string;
	companyAddress: string;
	companyEmail: string;
	paymentInstructions: string;
	paymentTermsDays: number;
	financialYearStartMonth: number;
	invoicePrefix: string;
	nextInvoiceNumber: number;
};

export async function getAccountingSettings(supabase: SupabaseClient): Promise<AccountingSettings> {
	const { data, error } = await supabase.from('accounting_settings').select('*').single();
	if (error) throw error;
	return {
		companyName: data.company_name,
		companyAddress: data.company_address,
		companyEmail: data.company_email,
		paymentInstructions: data.payment_instructions,
		paymentTermsDays: data.payment_terms_days,
		financialYearStartMonth: data.financial_year_start_month,
		invoicePrefix: data.invoice_prefix,
		nextInvoiceNumber: data.next_invoice_number
	};
}
