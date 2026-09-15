import { getDisplayName } from '$lib/server/auth/getDisplayName';
import type { Account } from './accountRecord';
import type { SupabaseClient, User } from '@supabase/supabase-js';

export async function getCurrentAccount(supabase: SupabaseClient, user: User): Promise<Account> {
	const email = user.email ?? '';
	const displayName = await getDisplayName(supabase);
	return { id: user.id, name: displayName === '' ? email : displayName, email };
}
