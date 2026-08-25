import type { JournalLineInput } from './postJournal';

export function debitLine(
	accountId: string,
	amount: number,
	costCentreId: string | null = null
): JournalLineInput {
	return { accountId, costCentreId, debit: amount, credit: 0 };
}

export function creditLine(
	accountId: string,
	amount: number,
	costCentreId: string | null = null
): JournalLineInput {
	return { accountId, costCentreId, debit: 0, credit: amount };
}

export function reversedLines(lines: JournalLineInput[]): JournalLineInput[] {
	return lines.map((line) => ({ ...line, debit: line.credit, credit: line.debit }));
}
