import { createAccrual } from '$lib/server/accounting/createAccrual';
import { createManualJournal, readJournalLinesForm } from '$lib/server/accounting/createManualJournal';
import { createPrepaymentRelease } from '$lib/server/accounting/createPrepaymentRelease';
import { activeCostCentres, getCostCentres } from '$lib/server/accounting/getCostCentres';
import { getJournalList } from '$lib/server/accounting/getJournalList';
import { activeAccountsOfType, getLedgerAccounts } from '$lib/server/accounting/getLedgerAccounts';
import { readAccrualForm, readPrepaymentReleaseForm } from '$lib/server/accounting/readPeriodEndForms';
import { readDateField, readRequiredText } from '$lib/server/accounting/readFormValues';
import { runAccountingCommand } from '$lib/server/accounting/runAccountingCommand';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const accounts = await getLedgerAccounts(locals.supabase);
	return {
		journals: await getJournalList(locals.supabase),
		accounts: accounts.filter((account) => !account.isArchived),
		expenseAccounts: activeAccountsOfType(accounts, 'expense'),
		costCentres: activeCostCentres(await getCostCentres(locals.supabase))
	};
};

export const actions: Actions = {
	createManualJournal: async ({ locals, request }) => {
		const formData = await request.formData();
		return runAccountingCommand(
			locals,
			() =>
				createManualJournal(locals.supabase, {
					journalDate: readDateField(formData, 'journalDate', 'Date'),
					description: readRequiredText(formData, 'description', 'Description'),
					lines: readJournalLinesForm(formData)
				}),
			'Journal posted.'
		);
	},
	createAccrual: async ({ locals, request }) => {
		const formData = await request.formData();
		return runAccountingCommand(
			locals,
			() => createAccrual(locals.supabase, readAccrualForm(formData)),
			'Accrual posted, with its reversal on the first of next month.'
		);
	},
	createPrepaymentRelease: async ({ locals, request }) => {
		const formData = await request.formData();
		return runAccountingCommand(
			locals,
			() => createPrepaymentRelease(locals.supabase, readPrepaymentReleaseForm(formData)),
			'Prepayment release journals posted for each month.'
		);
	}
};
