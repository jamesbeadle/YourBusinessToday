import type { Provider, SupabaseClient } from '@supabase/supabase-js';

const emailScopeProviders: Provider[] = ['azure'];

export async function beginOAuthSignIn(
	supabase: SupabaseClient,
	provider: Provider,
	origin: string
): Promise<string> {
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider,
		options: {
			redirectTo: `${origin}/auth/callback?next=/workspace`,
			scopes: emailScopeProviders.includes(provider) ? 'email' : undefined
		}
	});
	if (error) throw error;
	return data.url;
}
