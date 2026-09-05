import { accountingAdminAction } from './accountingAdminAction';
import { describeJournalInFull, describeJournalSummary, noSuchJournal } from './describeJournal';
import { getJournalList } from '$lib/server/accounting/getJournalList';
import { journalKindLabels } from '$lib/data/accounting/journalKinds';
import { objectSchema, readOptionalText, readText, textField } from '../actionTypes';
import { wholeNumberField } from './accountingFields';
import type { JournalSummary } from '$lib/server/accounting/getJournalList';
import type { McpAction } from '../actionTypes';

const everyKind = Object.keys(journalKindLabels).join(', ');

const defaultJournalCount = 30;

export const journalReadActions: McpAction[] = [
	accountingAdminAction({
		name: 'list_journals',
		isWrite: false,
		summary: 'list the most recent journals posted to the ledger',
		inputSchema: objectSchema({
			kind: textField(`Only journals of this kind, one of ${everyKind}`),
			journalCount: wholeNumberField(`How many to show, most recent first — defaults to ${defaultJournalCount}`)
		}),
		run: async (caller, input) => {
			const kind = readOptionalText(input, 'kind');
			const journals = await getJournalList(caller.supabase);
			const shown = journals.filter((journal) => isOfKind(journal, kind)).slice(0, readCount(input));
			if (shown.length === 0) return 'No journals match.';
			return shown.map(describeJournalSummary).join('\n');
		}
	}),
	accountingAdminAction({
		name: 'read_journal',
		isWrite: false,
		summary: 'read one journal with every debit and credit line',
		inputSchema: objectSchema({ journalId: textField('The journal id') }, ['journalId']),
		run: async (caller, input) => {
			const journals = await getJournalList(caller.supabase);
			const journal = journals.find((candidate) => candidate.id === readText(input, 'journalId'));
			if (journal === undefined) return noSuchJournal;
			return describeJournalInFull(journal);
		}
	})
];

function isOfKind(journal: JournalSummary, kind: string | null): boolean {
	if (kind === null) return true;
	return journal.kind === kind;
}

function readCount(input: Record<string, unknown>): number {
	const count = Number(input.journalCount);
	if (!Number.isInteger(count) || count < 1) return defaultJournalCount;
	return count;
}
