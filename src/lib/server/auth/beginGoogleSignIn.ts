import type { SupabaseClient } from '@supabase/supabase-js';

export async function beginGoogleSignIn(supabase: SupabaseClient, origin: string): Promise<string> {
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'google',
		options: { redirectTo: `${origin}/auth/callback?next=/workspace` }
	});
	if (error) throw error;
	return data.url;
}
