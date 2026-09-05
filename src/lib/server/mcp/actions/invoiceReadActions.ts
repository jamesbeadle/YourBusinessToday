import { accountingAdminAction } from './accountingAdminAction';
import { describeInvoiceInFull, describeInvoiceSummary, noSuchInvoice } from './describeInvoice';
import { getCostCentres } from '$lib/server/accounting/getCostCentres';
import { getInvoice } from '$lib/server/accounting/getInvoice';
import { getInvoiceList } from '$lib/server/accounting/getInvoiceList';
import { getLedgerAccounts } from '$lib/server/accounting/getLedgerAccounts';
import { invoiceIdField } from './accountingFields';
import { invoiceStatusLabels } from '$lib/data/accounting/invoiceStatus';
import { objectSchema, readOptionalText, readText, textField } from '../actionTypes';
import type { InvoiceStatus } from '$lib/data/accounting/invoiceStatus';
import type { InvoiceSummary } from '$lib/server/accounting/getInvoiceList';
import type { McpAction } from '../actionTypes';

const everyStatus = Object.keys(invoiceStatusLabels).join(', ');

export const invoiceReadActions: McpAction[] = [
	accountingAdminAction({
		name: 'list_invoices',
		isWrite: false,
		summary: 'list invoices, newest first, with what each still owes',
		inputSchema: objectSchema({
			clientId: textField('Only invoices for this client — leave out for every client'),
			status: textField(`Only invoices in this status, one of ${everyStatus}`)
		}),
		run: async (caller, input) => {
			const invoices = await getInvoiceList(caller.supabase, readOptionalText(input, 'clientId'));
			const status = readOptionalText(input, 'status');
			const shown = invoices.filter((invoice) => isInStatus(invoice, status));
			if (shown.length === 0) return 'No invoices match.';
			return shown.map(describeInvoiceSummary).join('\n');
		}
	}),
	accountingAdminAction({
		name: 'read_invoice',
		isWrite: false,
		summary: 'read one invoice in full with its lines, payments and status',
		inputSchema: objectSchema({ invoiceId: invoiceIdField }, ['invoiceId']),
		run: async (caller, input) => {
			const invoice = await getInvoice(caller.supabase, readText(input, 'invoiceId'));
			if (invoice === null) return noSuchInvoice;
			const accounts = await getLedgerAccounts(caller.supabase);
			const costCentres = await getCostCentres(caller.supabase);
			return describeInvoiceInFull(invoice, accounts, costCentres);
		}
	})
];

function isInStatus(invoice: InvoiceSummary, status: string | null): boolean {
	if (status === null) return true;
	return invoice.status === (status as InvoiceStatus);
}
