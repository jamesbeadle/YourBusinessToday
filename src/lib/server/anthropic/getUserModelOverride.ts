import type { SupabaseClient } from '@supabase/supabase-js';

export async function getUserModelOverride(supabase: SupabaseClient): Promise<string | null> {
	try {
		const { data, error } = await supabase
			.from('user_model_overrides')
			.select('model_id')
			.maybeSingle();
		if (error !== null) return null;
		return data?.model_id ?? null;
	} catch {
		return null;
	}
}
