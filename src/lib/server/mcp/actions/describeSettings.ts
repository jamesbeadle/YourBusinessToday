import { formatSortCode, hasBankDetails } from '$lib/data/accounting/bankDetails';
import { formatMonth } from '$lib/data/accounting/accountingPeriods';
import type { AccountingSettings } from '$lib/server/accounting/getAccountingSettings';

const anyYear = 2000;

export function describeSettings(settings: AccountingSettings): string {
	return [
		`Company: ${settings.companyName}`,
		describeOptional('Address', settings.companyAddress),
		describeOptional('Email', settings.companyEmail),
		describeOptional('Payment instructions', settings.paymentInstructions),
		describeBank(settings),
		`Payment terms: ${settings.paymentTermsDays} days`,
		`Financial year starts in ${nameOfMonth(settings.financialYearStartMonth)}`,
		`Invoice prefix: ${settings.invoicePrefix} — the next invoice will be ${settings.invoicePrefix}-${settings.nextInvoiceNumber}`
	]
		.filter((line) => line !== null)
		.join('\n');
}

function describeOptional(label: string, value: string): string | null {
	if (value === '') return null;
	return `${label}: ${value}`;
}

function describeBank(settings: AccountingSettings): string | null {
	if (!hasBankDetails(settings)) return null;
	const sortCode = formatSortCode(settings.bankSortCode);
	return `Bank: ${settings.bankAccountName}, account ${settings.bankAccountNumber}, sort code ${sortCode}`;
}

function nameOfMonth(month: number): string {
	const monthKey = `${anyYear}-${String(month).padStart(2, '0')}`;
	return formatMonth(monthKey).replace(` ${anyYear}`, '');
}
