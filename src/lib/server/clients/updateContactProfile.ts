import type { SupabaseClient } from '@supabase/supabase-js';
import { parseSeniority, parseWarmth } from '$lib/data/contactProfileFields';
import { toContactProfileColumns, type ContactProfile } from './clientContactRecord';

export type ContactProfileEdit = ContactProfile & {
	role: string;
	email: string;
	phone: string;
};

export function readContactProfileEdit(formData: FormData): ContactProfileEdit {
	return {
		role: readTrimmed(formData, 'role'),
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

export async function updateContactProfile(
	supabase: SupabaseClient,
	contactId: string,
	edit: ContactProfileEdit
): Promise<void> {
	const { error } = await supabase
		.from('client_contacts')
		.update({
			role: edit.role,
			email: edit.email,
			phone: edit.phone,
			...toContactProfileColumns(edit)
		})
		.eq('id', contactId);
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
