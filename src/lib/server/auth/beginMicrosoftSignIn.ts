import type { SupabaseClient } from '@supabase/supabase-js';
import { callbackUrlFor } from './callbackUrlFor';

export async function beginMicrosoftSignIn(
	supabase: SupabaseClient,
	origin: string,
	destination: string | null = null
): Promise<string> {
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'azure',
		options: {
			redirectTo: callbackUrlFor(origin, destination),
			scopes: 'openid profile email'
		}
	});
	if (error) throw error;
	return data.url;
}
