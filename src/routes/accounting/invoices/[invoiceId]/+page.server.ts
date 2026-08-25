import { error, redirect } from '@sveltejs/kit';
import { updateInvoiceDetails } from '$lib/server/accounting/createInvoice';
import { activeClients, getClients } from '$lib/server/accounting/getClients';
import { activeCostCentres, getCostCentres } from '$lib/server/accounting/getCostCentres';
import { getInvoice } from '$lib/server/accounting/getInvoice';
import { activeAccountsOfType, getLedgerAccounts } from '$lib/server/accounting/getLedgerAccounts';
import { issueInvoice } from '$lib/server/accounting/issueInvoice';
import { readInvoiceDetailsForm, readInvoiceLineForm } from '$lib/server/accounting/readInvoiceForms';
import { readDateField, readPositiveMoneyField, readRequiredText } from '$lib/server/accounting/readFormValues';
import { recordInvoicePayment } from '$lib/server/accounting/recordInvoicePayment';
import { runAccountingCommand } from '$lib/server/accounting/runAccountingCommand';
import { addInvoiceLine, deleteInvoiceLine, updateInvoiceLine } from '$lib/server/accounting/saveInvoiceLine';
import { voidInvoice } from '$lib/server/accounting/voidInvoice';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const invoice = await getInvoice(locals.supabase, params.invoiceId);
	if (invoice === null) error(404, 'No such invoice');
	return {
		invoice,
		clients: activeClients(await getClients(locals.supabase)),
		incomeAccounts: activeAccountsOfType(await getLedgerAccounts(locals.supabase), 'income'),
		costCentres: activeCostCentres(await getCostCentres(locals.supabase))
	};
};

export const actions: Actions = {
	updateDetails: async ({ locals, params, request }) => {
		const formData = await request.formData();
		return runAccountingCommand(
			locals,
			() => updateInvoiceDetails(locals.supabase, params.invoiceId, readInvoiceDetailsForm(formData)),
			'Invoice details saved.'
		);
	},
	addLine: async ({ locals, params, request }) => {
		const formData = await request.formData();
		return runAccountingCommand(
			locals,
			() => addInvoiceLine(locals.supabase, params.invoiceId, readInvoiceLineForm(formData)),
			'Line added.'
		);
	},
	updateLine: async ({ locals, request }) => {
		const formData = await request.formData();
		return runAccountingCommand(
			locals,
			() =>
				updateInvoiceLine(
					locals.supabase,
					readRequiredText(formData, 'lineId', 'Line'),
					readInvoiceLineForm(formData)
				),
			'Line saved.'
		);
	},
	deleteLine: async ({ locals, request }) => {
		const formData = await request.formData();
		return runAccountingCommand(
			locals,
			() => deleteInvoiceLine(locals.supabase, readRequiredText(formData, 'lineId', 'Line')),
			'Line removed.'
		);
	},
	issue: async ({ locals, params }) =>
		runAccountingCommand(
			locals,
			() => issueInvoice(locals.supabase, params.invoiceId),
			'Invoice issued and posted to the ledger.'
		),
	recordPayment: async ({ locals, params, request }) => {
		const formData = await request.formData();
		return runAccountingCommand(
			locals,
			() =>
				recordInvoicePayment(locals.supabase, {
					invoiceId: params.invoiceId,
					paidOn: readDateField(formData, 'paidOn', 'Payment date'),
					amount: readPositiveMoneyField(formData, 'amount', 'Amount')
				}),
			'Payment recorded.'
		);
	},
	void: async ({ locals, params }) => {
		const result = await runAccountingCommand(
			locals,
			() => voidInvoice(locals.supabase, params.invoiceId),
			'Invoice voided.'
		);
		if ('message' in result) redirect(303, '/accounting/invoices');
		return result;
	}
};
