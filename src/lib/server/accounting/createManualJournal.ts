import type { SupabaseClient } from '@supabase/supabase-js';
import { readMoneyField, readOptionalId, readText } from './readFormValues';
import { postJournal, type JournalLineInput } from './postJournal';

const manualJournalLineSlots = 6;

export async function createManualJournal(
	supabase: SupabaseClient,
	journal: { journalDate: string; description: string; lines: JournalLineInput[] }
): Promise<void> {
	await postJournal(supabase, { ...journal, kind: 'manual' });
}

export function readJournalLinesForm(formData: FormData): JournalLineInput[] {
	const slots = Array.from({ length: manualJournalLineSlots }, (_, slotIndex) => slotIndex);
	return slots
		.filter((slotIndex) => readText(formData, `accountId${slotIndex}`) !== '')
		.map((slotIndex) => ({
			accountId: readText(formData, `accountId${slotIndex}`),
			costCentreId: readOptionalId(formData, `costCentreId${slotIndex}`),
			debit: readMoneyField(formData, `debit${slotIndex}`, 'Debit'),
			credit: readMoneyField(formData, `credit${slotIndex}`, 'Credit')
		}));
}
