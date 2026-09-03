import type { SupabaseClient } from '@supabase/supabase-js';

// Admin pin first, then the user's own slider choice; null means the site
// default applies. Both reads are RLS-scoped to the caller's own rows.
export async function getUserModelOverride(supabase: SupabaseClient): Promise<string | null> {
	try {
		return (
			(await singleModelId(supabase, 'user_model_overrides')) ??
			(await singleModelId(supabase, 'user_model_preferences'))
		);
	} catch {
		return null;
	}
}

async function singleModelId(supabase: SupabaseClient, table: string): Promise<string | null> {
	const { data, error } = await supabase.from(table).select('model_id').maybeSingle();
	if (error !== null) return null;
	return data?.model_id ?? null;
}
