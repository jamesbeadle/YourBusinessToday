import type { SupabaseClient } from '@supabase/supabase-js';

export async function findPersonByEmail(supabase: SupabaseClient, email: string): Promise<string | null> {
	if (email === '') return null;
	return findPersonWhere(supabase, 'email', email.toLowerCase());
}

export async function findPersonByOfficerId(
	supabase: SupabaseClient,
	officerId: string
): Promise<string | null> {
	return findPersonWhere(supabase, 'companies_house_officer_id', officerId);
}

async function findPersonWhere(
	supabase: SupabaseClient,
	column: string,
	value: string
): Promise<string | null> {
	const { data, error } = await supabase
		.from('people')
		.select('id')
		.eq(column, value)
		.limit(1)
		.maybeSingle();
	if (error) throw error;
	if (data === null) return null;
	return data.id as string;
}
