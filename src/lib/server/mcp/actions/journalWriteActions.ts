import { accountingAdminAction } from './accountingAdminAction';
import { costCentreIdField, isoDateDescription, moneyField } from './accountingFields';
import { createManualJournal, readJournalLinesForm } from '$lib/server/accounting/createManualJournal';
import { formDataFromInput } from './formDataFromInput';
import { formatBritishDate } from '$lib/data/britishDate';
import { formatMoney, sumMoney } from '$lib/data/accounting/money';
import { objectSchema, textField } from '../actionTypes';
import { readDateField, readRequiredText } from '$lib/server/accounting/readFormValues';
import type { McpAction } from '../actionTypes';

const manualJournalLineSlotsOnSite = 6;

const lineSchema = objectSchema(
	{
		accountId: textField('The ledger account id'),
		costCentreId: costCentreIdField,
		debit: moneyField('Amount to debit — leave out or zero when crediting'),
		credit: moneyField('Amount to credit — leave out or zero when debiting')
	},
	['accountId']
);

export const journalWriteActions: McpAction[] = [
	accountingAdminAction({
		name: 'create_manual_journal',
		isWrite: true,
		summary: 'post a manual journal of balancing debit and credit lines',
		guidance:
			'A journal must balance — total debits equal total credits — and once posted it cannot ' +
			'be edited, only reversed by posting an opposite journal. Invoices and expenses post ' +
			'their own journals; use this for adjustments the site has no form for.',
		inputSchema: objectSchema(
			{
				journalDate: textField(`The date the entry takes effect ${isoDateDescription}`),
				description: textField('What the journal is for'),
				lines: {
					type: 'array',
					description: `Between two and ${manualJournalLineSlotsOnSite} lines`,
					items: lineSchema
				}
			},
			['journalDate', 'description', 'lines']
		),
		run: async (caller, input) => {
			const lines = readLines(input);
			if (lines === null) return `Give the journal between two and ${manualJournalLineSlotsOnSite} lines.`;
			const formData = formDataFromInput(input);
			const journalDate = readDateField(formData, 'journalDate', 'Date');
			const description = readRequiredText(formData, 'description', 'Description');
			const journalLines = readJournalLinesForm(formDataFromInput(slotFields(lines)));
			await createManualJournal(caller.supabase, { journalDate, description, lines: journalLines });
			const moved = formatMoney(sumMoney(journalLines.map((line) => line.debit)));
			return `Journal posted: ${description} on ${formatBritishDate(journalDate)}, moving ${moved}.`;
		}
	})
];

function readLines(input: Record<string, unknown>): Record<string, unknown>[] | null {
	const lines = input.lines;
	if (!Array.isArray(lines)) return null;
	if (lines.length === 0 || lines.length > manualJournalLineSlotsOnSite) return null;
	return lines.filter((line) => typeof line === 'object' && line !== null);
}

function slotFields(lines: Record<string, unknown>[]): Record<string, unknown> {
	return Object.fromEntries(
		lines.flatMap((line, slotIndex) =>
			Object.entries(line).map(([field, value]) => [`${field}${slotIndex}`, value])
		)
	);
}
