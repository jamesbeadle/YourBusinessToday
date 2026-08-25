import type { ExpenseInput } from './recordExpense';
import {
	readDateField,
	readIsChecked,
	readOptionalId,
	readPositiveMoneyField,
	readRequiredText,
	readText
} from './readFormValues';

export function readExpenseForm(formData: FormData): ExpenseInput {
	return {
		expenseDate: readDateField(formData, 'expenseDate', 'Date'),
		supplier: readRequiredText(formData, 'supplier', 'Supplier'),
		description: readText(formData, 'description'),
		amount: readPositiveMoneyField(formData, 'amount', 'Amount'),
		expenseAccountId: readRequiredText(formData, 'expenseAccountId', 'Account'),
		costCentreId: readOptionalId(formData, 'costCentreId'),
		isPaid: readIsChecked(formData, 'isPaid')
	};
}
