import type { SupabaseClient } from '@supabase/supabase-js';

export type ProfileFlags = { isAdmin: boolean; isRestricted: boolean };

export async function getProfileFlags(supabase: SupabaseClient): Promise<ProfileFlags> {
	const { data, error } = await supabase
		.from('profiles')
		.select('is_admin, is_restricted')
		.maybeSingle();
	if (error) throw error;
	return {
		isAdmin: data?.is_admin ?? false,
		isRestricted: data?.is_restricted ?? false
	};
}
