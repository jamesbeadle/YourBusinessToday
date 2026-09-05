import { accountingAdminAction } from './accountingAdminAction';
import { addDays, toIsoDate } from '$lib/data/accounting/accountingPeriods';
import { createInvoice, updateInvoiceDetails } from '$lib/server/accounting/createInvoice';
import { deleteInvoice } from '$lib/server/accounting/deleteInvoice';
import { formDataFromInput, withoutBlankFields } from './formDataFromInput';
import { getAccountingSettings } from '$lib/server/accounting/getAccountingSettings';
import { getInvoice } from '$lib/server/accounting/getInvoice';
import { invoiceIdField, isoDateDescription } from './accountingFields';
import { isRefusal, resolveDraftInvoice } from './resolveDraftInvoice';
import { noSuchInvoice } from './describeInvoice';
import { objectSchema, readOptionalText, readText, textField } from '../actionTypes';
import { readDateField } from '$lib/server/accounting/readFormValues';
import { readInvoiceDetailsForm } from '$lib/server/accounting/readInvoiceForms';
import type { InvoiceDetail } from '$lib/server/accounting/getInvoice';
import type { McpAction } from '../actionTypes';
import type { SupabaseClient } from '@supabase/supabase-js';

const detailFields = {
	clientId: textField('The client the invoice is for'),
	issueDate: textField(`Issue date ${isoDateDescription} — defaults to today`),
	dueDate: textField(`Due date ${isoDateDescription} — defaults to the payment terms after issue`),
	reference: textField('The client purchase order or other reference'),
	notes: textField('Notes printed on the invoice')
};

export const invoiceDraftActions: McpAction[] = [
	accountingAdminAction({
		name: 'create_invoice',
		isWrite: true,
		summary: 'draft a new invoice for a client, ready for its lines',
		guidance:
			'Draft an invoice, issue it to post the sale, then record the payment when it lands. ' +
			'A draft can be edited freely; nothing reaches the ledger until it is issued.',
		inputSchema: objectSchema(detailFields, ['clientId']),
		run: async (caller, input) => {
			const withDates = await withDefaultDates(caller.supabase, input);
			const details = readInvoiceDetailsForm(formDataFromInput(withDates));
			const invoiceId = await createInvoice(caller.supabase, details);
			const invoice = await getInvoice(caller.supabase, invoiceId);
			if (invoice === null) return noSuchInvoice;
			return `Invoice #${invoice.invoiceNumber} drafted for ${invoice.client.name} (id: ${invoice.id}). Add lines, then issue it.`;
		}
	}),
	accountingAdminAction({
		name: 'update_invoice_details',
		isWrite: true,
		summary: 'change the client, dates, reference or notes on a draft invoice',
		inputSchema: objectSchema({ invoiceId: invoiceIdField, ...detailFields }, ['invoiceId']),
		run: async (caller, input) => {
			const invoice = await resolveDraftInvoice(caller.supabase, readText(input, 'invoiceId'));
			if (isRefusal(invoice)) return invoice;
			const merged = { ...currentDetails(invoice), ...withoutBlankFields(input) };
			await updateInvoiceDetails(caller.supabase, invoice.id, readInvoiceDetailsForm(formDataFromInput(merged)));
			return `Invoice #${invoice.invoiceNumber} details saved.`;
		}
	}),
	accountingAdminAction({
		name: 'delete_invoice',
		isWrite: true,
		summary: 'delete a draft or voided invoice',
		guidance:
			'Only a draft or a voided invoice can be deleted. An issued invoice has been posted to ' +
			'the ledger, so it is voided instead — that reverses the posting rather than removing it.',
		inputSchema: objectSchema({ invoiceId: invoiceIdField }, ['invoiceId']),
		run: async (caller, input) => {
			const invoice = await getInvoice(caller.supabase, readText(input, 'invoiceId'));
			if (invoice === null) return noSuchInvoice;
			await deleteInvoice(caller.supabase, invoice.id);
			return `Invoice #${invoice.invoiceNumber} deleted.`;
		}
	})
];

async function withDefaultDates(
	supabase: SupabaseClient,
	input: Record<string, unknown>
): Promise<Record<string, unknown>> {
	const issueDate = readOptionalText(input, 'issueDate') ?? toIsoDate(new Date());
	const dueDate = readOptionalText(input, 'dueDate') ?? (await defaultDueDate(supabase, issueDate));
	return { ...input, issueDate, dueDate };
}

async function defaultDueDate(supabase: SupabaseClient, issueDate: string): Promise<string> {
	const validIssueDate = readDateField(formDataFromInput({ issueDate }), 'issueDate', 'Issue date');
	const settings = await getAccountingSettings(supabase);
	return addDays(validIssueDate, settings.paymentTermsDays);
}

function currentDetails(invoice: InvoiceDetail): Record<string, unknown> {
	return {
		clientId: invoice.client.id,
		issueDate: invoice.issueDate,
		dueDate: invoice.dueDate,
		reference: invoice.reference,
		notes: invoice.notes
	};
}
