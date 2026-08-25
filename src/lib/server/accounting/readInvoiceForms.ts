import type { InvoiceDetailsInput } from './createInvoice';
import type { InvoiceLineInput } from './saveInvoiceLine';
import {
	readDateField,
	readMoneyField,
	readOptionalId,
	readRequiredText,
	readText
} from './readFormValues';

export function readInvoiceDetailsForm(formData: FormData): InvoiceDetailsInput {
	return {
		clientId: readRequiredText(formData, 'clientId', 'Client'),
		issueDate: readDateField(formData, 'issueDate', 'Issue date'),
		dueDate: readDateField(formData, 'dueDate', 'Due date'),
		reference: readText(formData, 'reference'),
		notes: readText(formData, 'notes')
	};
}

export function readInvoiceLineForm(formData: FormData): InvoiceLineInput {
	return {
		description: readRequiredText(formData, 'description', 'Description'),
		quantity: readMoneyField(formData, 'quantity', 'Quantity'),
		unitPrice: readMoneyField(formData, 'unitPrice', 'Unit price'),
		incomeAccountId: readRequiredText(formData, 'incomeAccountId', 'Income account'),
		costCentreId: readOptionalId(formData, 'costCentreId')
	};
}
