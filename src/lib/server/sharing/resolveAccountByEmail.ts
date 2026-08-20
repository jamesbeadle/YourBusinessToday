import { supabaseServiceClient } from '$lib/server/payments/supabaseServiceClient';

export type ResolvedAccount = { id: string; email: string };

export async function resolveAccountByEmail(email: string): Promise<ResolvedAccount | null> {
	const { data, error } = await supabaseServiceClient()
		.from('profiles')
		.select('id, email')
		.ilike('email', email.trim())
		.maybeSingle();
	if (error !== null) throw error;
	if (data === null) return null;
	return { id: data.id, email: data.email };
}
