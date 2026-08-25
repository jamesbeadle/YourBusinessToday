import type { SupabaseClient } from '@supabase/supabase-js';

export type AccountingSettingsInput = {
	companyName: string;
	companyAddress: string;
	companyEmail: string;
	paymentInstructions: string;
	bankAccountName: string;
	bankAccountNumber: string;
	bankSortCode: string;
	paymentTermsDays: number;
	financialYearStartMonth: number;
	invoicePrefix: string;
};

export async function saveAccountingSettings(
	supabase: SupabaseClient,
	settings: AccountingSettingsInput
): Promise<void> {
	const { error } = await supabase
		.from('accounting_settings')
		.update({
			company_name: settings.companyName,
			company_address: settings.companyAddress,
			company_email: settings.companyEmail,
			payment_instructions: settings.paymentInstructions,
			bank_account_name: settings.bankAccountName,
			bank_account_number: settings.bankAccountNumber,
			bank_sort_code: settings.bankSortCode,
			payment_terms_days: settings.paymentTermsDays,
			financial_year_start_month: settings.financialYearStartMonth,
			invoice_prefix: settings.invoicePrefix,
			updated_at: new Date().toISOString()
		})
		.eq('id', true);
	if (error) throw error;
}
