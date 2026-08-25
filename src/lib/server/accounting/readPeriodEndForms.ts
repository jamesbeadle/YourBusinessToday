import type { AccrualInput } from './createAccrual';
import type { PrepaymentReleaseInput } from './createPrepaymentRelease';
import { AccountingError } from './accountingErrors';
import {
	readOptionalId,
	readPositiveMoneyField,
	readRequiredText,
	readText,
	readWholeNumberField
} from './readFormValues';

const monthKeyPattern = /^\d{4}-\d{2}$/;

export function readAccrualForm(formData: FormData): AccrualInput {
	return {
		monthKey: readMonthField(formData, 'monthKey', 'Month'),
		description: readRequiredText(formData, 'description', 'Description'),
		amount: readPositiveMoneyField(formData, 'amount', 'Amount'),
		expenseAccountId: readRequiredText(formData, 'expenseAccountId', 'Expense account'),
		costCentreId: readOptionalId(formData, 'costCentreId')
	};
}

export function readPrepaymentReleaseForm(formData: FormData): PrepaymentReleaseInput {
	return {
		firstMonthKey: readMonthField(formData, 'firstMonthKey', 'First month'),
		monthCount: readWholeNumberField(formData, 'monthCount', 'Months'),
		totalAmount: readPositiveMoneyField(formData, 'totalAmount', 'Total amount'),
		description: readRequiredText(formData, 'description', 'Description'),
		expenseAccountId: readRequiredText(formData, 'expenseAccountId', 'Expense account'),
		costCentreId: readOptionalId(formData, 'costCentreId')
	};
}

function readMonthField(formData: FormData, name: string, label: string): string {
	const value = readText(formData, name);
	if (!monthKeyPattern.test(value)) throw new AccountingError(`${label} needs a month.`);
	return value;
}
