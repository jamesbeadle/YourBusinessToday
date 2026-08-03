import type { SupabaseClient } from '@supabase/supabase-js';

export type StaffMember = { id: string; name: string };

export async function getStaffDirectory(supabase: SupabaseClient): Promise<StaffMember[]> {
	const { data, error } = await supabase.rpc('staff_directory');
	if (error) throw error;
	return data.map((row: Record<string, unknown>) => ({
		id: row.id as string,
		name: displayNameOrEmail(row)
	}));
}

function displayNameOrEmail(row: Record<string, unknown>): string {
	const displayName = (row.display_name as string).trim();
	if (displayName !== '') return displayName;
	return row.email as string;
}
