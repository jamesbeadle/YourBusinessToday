import type { SupabaseClient } from '@supabase/supabase-js';

export async function beginMicrosoftSignIn(
	supabase: SupabaseClient,
	origin: string
): Promise<string> {
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'azure',
		options: {
			redirectTo: `${origin}/auth/callback?next=/workspace`,
			scopes: 'openid profile email'
		}
	});
	if (error) throw error;
	return data.url;
}
