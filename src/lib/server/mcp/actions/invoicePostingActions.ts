import { accountingAdminAction } from './accountingAdminAction';
import { formDataFromInput } from './formDataFromInput';
import { formatBritishDate } from '$lib/data/britishDate';
import { formatMoney } from '$lib/data/accounting/money';
import { getInvoice } from '$lib/server/accounting/getInvoice';
import { invoiceIdField, isoDateDescription, moneyField } from './accountingFields';
import { issueInvoice } from '$lib/server/accounting/issueInvoice';
import { noSuchInvoice, outstandingOn } from './describeInvoice';
import { objectSchema, readText, textField } from '../actionTypes';
import { readDateField, readPositiveMoneyField } from '$lib/server/accounting/readFormValues';
import { recordInvoicePayment } from '$lib/server/accounting/recordInvoicePayment';
import { voidInvoice } from '$lib/server/accounting/voidInvoice';
import type { McpAction } from '../actionTypes';

const invoiceIdOnly = objectSchema({ invoiceId: invoiceIdField }, ['invoiceId']);

export const invoicePostingActions: McpAction[] = [
	accountingAdminAction({
		name: 'issue_invoice',
		isWrite: true,
		summary: 'issue a draft invoice, posting the sale to the ledger',
		guidance:
			'Issuing posts the sale to the ledger — trade debtors against the income accounts on ' +
			'its lines — and the invoice stops being editable. Money moves through journals and ' +
			'cannot be edited, only reversed, so make sure the draft is right first.',
		inputSchema: invoiceIdOnly,
		run: async (caller, input) => {
			const invoice = await getInvoice(caller.supabase, readText(input, 'invoiceId'));
			if (invoice === null) return noSuchInvoice;
			await issueInvoice(caller.supabase, invoice.id);
			const due = formatBritishDate(invoice.dueDate);
			return `Invoice #${invoice.invoiceNumber} issued and posted to the ledger — ${invoice.client.name} owes ${formatMoney(invoice.total)}, due ${due}.`;
		}
	}),
	accountingAdminAction({
		name: 'record_invoice_payment',
		isWrite: true,
		summary: 'record money received against an issued invoice',
		guidance:
			'The payment posts to the ledger — bank against trade debtors — and the invoice is ' +
			'marked paid once the whole total has been received.',
		inputSchema: objectSchema(
			{
				invoiceId: invoiceIdField,
				paidOn: textField(`The date the money arrived ${isoDateDescription}`),
				amount: moneyField('How much arrived')
			},
			['invoiceId', 'paidOn', 'amount']
		),
		run: async (caller, input) => {
			const invoice = await getInvoice(caller.supabase, readText(input, 'invoiceId'));
			if (invoice === null) return noSuchInvoice;
			const formData = formDataFromInput(input);
			const amount = readPositiveMoneyField(formData, 'amount', 'Amount');
			await recordInvoicePayment(caller.supabase, {
				invoiceId: invoice.id,
				paidOn: readDateField(formData, 'paidOn', 'Payment date'),
				amount
			});
			const settled = await getInvoice(caller.supabase, invoice.id);
			if (settled === null) return noSuchInvoice;
			return `Payment of ${formatMoney(amount)} recorded against invoice #${invoice.invoiceNumber}. ${describeRemaining(settled)}`;
		}
	}),
	accountingAdminAction({
		name: 'void_invoice',
		isWrite: true,
		summary: 'void an issued invoice, reversing its posting',
		guidance:
			'Voiding reverses rather than deletes: a fresh journal undoes the original posting and ' +
			'the invoice is marked void. An invoice with payments recorded cannot be voided.',
		inputSchema: invoiceIdOnly,
		run: async (caller, input) => {
			const invoice = await getInvoice(caller.supabase, readText(input, 'invoiceId'));
			if (invoice === null) return noSuchInvoice;
			if (invoice.status === 'void') return `Invoice #${invoice.invoiceNumber} is already void.`;
			await voidInvoice(caller.supabase, invoice.id);
			return `Invoice #${invoice.invoiceNumber} voided and its posting reversed.`;
		}
	})
];

function describeRemaining(invoice: { total: number; amountPaid: number }): string {
	const outstanding = outstandingOn(invoice);
	if (outstanding === 0) return 'It is now paid in full.';
	return `${formatMoney(outstanding)} is still outstanding.`;
}
