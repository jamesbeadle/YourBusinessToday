import { accountingAdminAction } from './accountingAdminAction';
import { describeSettings } from './describeSettings';
import { formDataFromInput, withoutBlankFields } from './formDataFromInput';
import { getAccountingSettings } from '$lib/server/accounting/getAccountingSettings';
import { keepCurrent, wholeNumberField } from './accountingFields';
import { objectSchema, textField } from '../actionTypes';
import { readRequiredText, readText, readWholeNumberField } from '$lib/server/accounting/readFormValues';
import { saveAccountingSettings } from '$lib/server/accounting/saveAccountingSettings';
import type { AccountingSettingsInput } from '$lib/server/accounting/saveAccountingSettings';
import type { McpAction } from '../actionTypes';

export const settingsActions: McpAction[] = [
	accountingAdminAction({
		name: 'read_accounting_settings',
		isWrite: false,
		summary: 'read the company, bank and invoicing settings',
		inputSchema: objectSchema({}),
		run: async (caller) => describeSettings(await getAccountingSettings(caller.supabase))
	}),
	accountingAdminAction({
		name: 'save_accounting_settings',
		isWrite: true,
		summary: 'change the company, bank or invoicing settings',
		inputSchema: objectSchema({
			companyName: textField(keepCurrent('The company name printed on invoices')),
			companyAddress: textField(keepCurrent('The company address')),
			companyEmail: textField(keepCurrent('The company email')),
			paymentInstructions: textField(keepCurrent('How clients should pay')),
			bankAccountName: textField(keepCurrent('The bank account name')),
			bankAccountNumber: textField(keepCurrent('The bank account number')),
			bankSortCode: textField(keepCurrent('The bank sort code')),
			paymentTermsDays: wholeNumberField(keepCurrent('Days from issue to due')),
			financialYearStartMonth: wholeNumberField(keepCurrent('The month the financial year starts, 1 to 12')),
			invoicePrefix: textField(keepCurrent('The prefix before every invoice number'))
		}),
		run: async (caller, input) => {
			const current = await getAccountingSettings(caller.supabase);
			const merged = { ...current, ...withoutBlankFields(input) };
			await saveAccountingSettings(caller.supabase, readSettings(formDataFromInput(merged)));
			return 'Settings saved.';
		}
	})
];

function readSettings(formData: FormData): AccountingSettingsInput {
	return {
		companyName: readRequiredText(formData, 'companyName', 'Company name'),
		companyAddress: readText(formData, 'companyAddress'),
		companyEmail: readText(formData, 'companyEmail'),
		paymentInstructions: readText(formData, 'paymentInstructions'),
		bankAccountName: readText(formData, 'bankAccountName'),
		bankAccountNumber: readText(formData, 'bankAccountNumber'),
		bankSortCode: readText(formData, 'bankSortCode'),
		paymentTermsDays: readWholeNumberField(formData, 'paymentTermsDays', 'Payment terms'),
		financialYearStartMonth: readWholeNumberField(formData, 'financialYearStartMonth', 'Year start'),
		invoicePrefix: readRequiredText(formData, 'invoicePrefix', 'Invoice prefix')
	};
}
