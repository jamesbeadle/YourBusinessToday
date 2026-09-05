import { accountingAdminAction } from './accountingAdminAction';
import { addInvoiceLine, deleteInvoiceLine, updateInvoiceLine } from '$lib/server/accounting/saveInvoiceLine';
import { costCentreIdField, invoiceIdField, moneyField } from './accountingFields';
import { formDataFromInput, withoutBlankFields } from './formDataFromInput';
import { formatMoney } from '$lib/data/accounting/money';
import { isRefusal, resolveDraftInvoice } from './resolveDraftInvoice';
import { objectSchema, readText, textField } from '../actionTypes';
import { readInvoiceLineForm } from '$lib/server/accounting/readInvoiceForms';
import type { InvoiceDetail, InvoiceLine } from '$lib/server/accounting/getInvoice';
import type { InvoiceLineInput } from '$lib/server/accounting/saveInvoiceLine';
import type { McpAction } from '../actionTypes';

const noSuchLine = 'No line on that invoice has that id. Call read_invoice to see its lines.';

const lineIdField = textField('The line id, from read_invoice');

const lineFields = {
	description: textField('What the line is for'),
	quantity: { type: 'number', description: 'How many' },
	unitPrice: moneyField('Price per unit'),
	incomeAccountId: textField('The income ledger account the sale posts to'),
	costCentreId: costCentreIdField
};

export const invoiceLineActions: McpAction[] = [
	accountingAdminAction({
		name: 'add_invoice_line',
		isWrite: true,
		summary: 'add a line to a draft invoice',
		inputSchema: objectSchema(
			{ invoiceId: invoiceIdField, ...lineFields },
			['invoiceId', 'description', 'quantity', 'unitPrice', 'incomeAccountId']
		),
		run: async (caller, input) => {
			const invoice = await resolveDraftInvoice(caller.supabase, readText(input, 'invoiceId'));
			if (isRefusal(invoice)) return invoice;
			const line = readInvoiceLineForm(formDataFromInput(input));
			await addInvoiceLine(caller.supabase, invoice.id, line);
			return `Line added to invoice #${invoice.invoiceNumber}: ${describeLine(line)}.`;
		}
	}),
	accountingAdminAction({
		name: 'update_invoice_line',
		isWrite: true,
		summary: 'change a line on a draft invoice',
		inputSchema: objectSchema(
			{ invoiceId: invoiceIdField, lineId: lineIdField, ...lineFields },
			['invoiceId', 'lineId']
		),
		run: async (caller, input) => {
			const invoice = await resolveDraftInvoice(caller.supabase, readText(input, 'invoiceId'));
			if (isRefusal(invoice)) return invoice;
			const current = findLine(invoice, readText(input, 'lineId'));
			if (current === null) return noSuchLine;
			const merged = { ...currentLineFields(current), ...withoutBlankFields(input) };
			const line = readInvoiceLineForm(formDataFromInput(merged));
			await updateInvoiceLine(caller.supabase, current.id, line);
			return `Line saved on invoice #${invoice.invoiceNumber}: ${describeLine(line)}.`;
		}
	}),
	accountingAdminAction({
		name: 'delete_invoice_line',
		isWrite: true,
		summary: 'remove a line from a draft invoice',
		inputSchema: objectSchema({ invoiceId: invoiceIdField, lineId: lineIdField }, ['invoiceId', 'lineId']),
		run: async (caller, input) => {
			const invoice = await resolveDraftInvoice(caller.supabase, readText(input, 'invoiceId'));
			if (isRefusal(invoice)) return invoice;
			const line = findLine(invoice, readText(input, 'lineId'));
			if (line === null) return noSuchLine;
			await deleteInvoiceLine(caller.supabase, line.id);
			return `Line removed from invoice #${invoice.invoiceNumber}: ${line.description}.`;
		}
	})
];

function findLine(invoice: InvoiceDetail, lineId: string): InvoiceLine | null {
	return invoice.lines.find((line) => line.id === lineId) ?? null;
}

function currentLineFields(line: InvoiceLine): Record<string, unknown> {
	return {
		description: line.description,
		quantity: line.quantity,
		unitPrice: line.unitPrice,
		incomeAccountId: line.incomeAccountId,
		costCentreId: line.costCentreId
	};
}

function describeLine(line: InvoiceLineInput): string {
	return `${line.description}, ${line.quantity} × ${formatMoney(line.unitPrice)}`;
}
