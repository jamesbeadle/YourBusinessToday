import { textField } from '../actionTypes';

export const invoiceIdField = textField('The invoice id');

export const expenseIdField = textField('The expense id');

export const isoDateDescription = 'as YYYY-MM-DD';

export const monthKeyDescription = 'as YYYY-MM';

export const moneyField = (description: string) => ({
	type: 'number',
	description: `${description}, in pounds`
});

export const wholeNumberField = (description: string) => ({
	type: 'number',
	description
});

export const costCentreIdField = textField('The cost centre id — leave out for none');

export const isArchivedField = {
	type: 'boolean',
	description: 'True to archive it, false to bring it back'
};

export function keepCurrent(description: string): string {
	return `${description} — leave out to keep what is there`;
}

export function describeArchiveChange(isArchived: boolean): string {
	if (isArchived) return 'archived';
	return 'brought back';
}

export const sayWhetherToArchive =
	'Say whether it should be archived (isArchived true) or brought back (isArchived false).';

export function readIsArchived(input: Record<string, unknown>): boolean | null {
	if (typeof input.isArchived !== 'boolean') return null;
	return input.isArchived;
}
