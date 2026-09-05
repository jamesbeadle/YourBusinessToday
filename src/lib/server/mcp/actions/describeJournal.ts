import { formatBritishDate } from '$lib/data/britishDate';
import { formatMoney } from '$lib/data/accounting/money';
import { journalKindLabels } from '$lib/data/accounting/journalKinds';
import type { JournalLineSummary, JournalSummary } from '$lib/server/accounting/getJournalList';

export const noSuchJournal = 'No recent journal has that id. Call list_journals to see them.';

export function describeJournalSummary(journal: JournalSummary): string {
	const kind = journalKindLabels[journal.kind];
	return `${formatBritishDate(journal.journalDate)} — ${journal.description} — ${kind} — ${formatMoney(journal.total)} (id: ${journal.id})`;
}

export function describeJournalInFull(journal: JournalSummary): string {
	return [describeJournalSummary(journal), 'Lines:', ...journal.lines.map(describeJournalLine)].join(
		'\n'
	);
}

function describeJournalLine(line: JournalLineSummary): string {
	const costCentre = line.costCentreName === null ? '' : ` — ${line.costCentreName}`;
	return `${line.accountCode} ${line.accountName} — ${describeSide(line)}${costCentre}`;
}

function describeSide(line: JournalLineSummary): string {
	if (line.debit > 0) return `debit ${formatMoney(line.debit)}`;
	return `credit ${formatMoney(line.credit)}`;
}
