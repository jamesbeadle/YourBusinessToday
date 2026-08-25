import { createLedgerAccount, setLedgerAccountArchived } from '$lib/server/accounting/createLedgerAccount';
import { getLedgerAccounts } from '$lib/server/accounting/getLedgerAccounts';
import { readIsChecked, readRequiredText } from '$lib/server/accounting/readFormValues';
import { runAccountingCommand } from '$lib/server/accounting/runAccountingCommand';
import { AccountingError } from '$lib/server/accounting/accountingErrors';
import { ledgerAccountTypeOrder, type LedgerAccountType } from '$lib/data/accounting/ledgerAccountTypes';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	return { accounts: await getLedgerAccounts(locals.supabase) };
};

export const actions: Actions = {
	createAccount: async ({ locals, request }) => {
		const formData = await request.formData();
		return runAccountingCommand(
			locals,
			() =>
				createLedgerAccount(locals.supabase, {
					code: readRequiredText(formData, 'code', 'Code'),
					name: readRequiredText(formData, 'name', 'Name'),
					accountType: readAccountType(formData)
				}),
			'Account added to the chart.'
		);
	},
	setArchived: async ({ locals, request }) => {
		const formData = await request.formData();
		return runAccountingCommand(
			locals,
			() =>
				setLedgerAccountArchived(
					locals.supabase,
					readRequiredText(formData, 'accountId', 'Account'),
					readIsChecked(formData, 'isArchived')
				),
			'Account updated.'
		);
	}
};

function readAccountType(formData: FormData): LedgerAccountType {
	const accountType = readRequiredText(formData, 'accountType', 'Type') as LedgerAccountType;
	if (!ledgerAccountTypeOrder.includes(accountType)) {
		throw new AccountingError('Choose one of the listed account types.');
	}
	return accountType;
}
