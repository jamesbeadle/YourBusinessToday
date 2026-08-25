import { activeCostCentres, getCostCentres } from '$lib/server/accounting/getCostCentres';
import { getExpenses } from '$lib/server/accounting/getExpenses';
import { activeAccountsOfType, getLedgerAccounts } from '$lib/server/accounting/getLedgerAccounts';
import { deleteExpense, payExpense } from '$lib/server/accounting/payExpense';
import { readExpenseForm } from '$lib/server/accounting/readExpenseForm';
import { readDateField, readRequiredText } from '$lib/server/accounting/readFormValues';
import { recordExpense } from '$lib/server/accounting/recordExpense';
import { runAccountingCommand } from '$lib/server/accounting/runAccountingCommand';
import { SystemAccountCodes } from '$lib/data/accounting/systemAccountCodes';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const accounts = await getLedgerAccounts(locals.supabase);
	const prepaymentsAccount = accounts.filter((account) => account.code === SystemAccountCodes.Prepayments);
	return {
		expenses: await getExpenses(locals.supabase),
		expenseAccounts: [...activeAccountsOfType(accounts, 'expense'), ...prepaymentsAccount],
		costCentres: activeCostCentres(await getCostCentres(locals.supabase))
	};
};

export const actions: Actions = {
	recordExpense: async ({ locals, request }) => {
		const formData = await request.formData();
		return runAccountingCommand(
			locals,
			() => recordExpense(locals.supabase, readExpenseForm(formData)),
			'Expense recorded and posted to the ledger.'
		);
	},
	payExpense: async ({ locals, request }) => {
		const formData = await request.formData();
		return runAccountingCommand(
			locals,
			() =>
				payExpense(locals.supabase, {
					expenseId: readRequiredText(formData, 'expenseId', 'Expense'),
					paidOn: readDateField(formData, 'paidOn', 'Payment date')
				}),
			'Expense marked as paid.'
		);
	},
	deleteExpense: async ({ locals, request }) => {
		const formData = await request.formData();
		return runAccountingCommand(
			locals,
			() => deleteExpense(locals.supabase, readRequiredText(formData, 'expenseId', 'Expense')),
			'Expense deleted along with its ledger entries.'
		);
	}
};
