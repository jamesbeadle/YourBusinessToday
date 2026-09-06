import type { SupabaseClient } from '@supabase/supabase-js';
import { parseSeniority, parseWarmth } from '$lib/data/contactProfileFields';
import { toPersonProfileColumns, type PersonProfile } from './personRecord';

export type PersonProfileEdit = PersonProfile & {
	name: string;
	email: string;
	phone: string;
};

export function readPersonProfileEdit(formData: FormData): PersonProfileEdit | null {
	const name = readTrimmed(formData, 'name');
	if (name === '') return null;
	return {
		name,
		email: readTrimmed(formData, 'email').toLowerCase(),
		phone: readTrimmed(formData, 'phone'),
		seniority: parseSeniority(formData.get('seniority')),
		isDecisionMaker: formData.get('isDecisionMaker') === 'on',
		warmth: parseWarmth(formData.get('warmth')),
		lastContactedOn: readDate(formData, 'lastContactedOn'),
		nextAction: readTrimmed(formData, 'nextAction'),
		nextActionDue: readDate(formData, 'nextActionDue')
	};
}

export async function updatePersonProfile(
	supabase: SupabaseClient,
	personId: string,
	edit: PersonProfileEdit
): Promise<void> {
	const { error } = await supabase
		.from('people')
		.update({
			name: edit.name,
			email: edit.email,
			phone: edit.phone,
			updated_at: new Date().toISOString(),
			...toPersonProfileColumns(edit)
		})
		.eq('id', personId);
	if (error) throw error;
}

function readTrimmed(formData: FormData, field: string): string {
	return String(formData.get(field) ?? '').trim();
}

function readDate(formData: FormData, field: string): string | null {
	const value = readTrimmed(formData, field);
	if (value === '') return null;
	return value;
}
