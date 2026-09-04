import type { SupabaseClient } from '@supabase/supabase-js';

export const longestRequestBody = 4000;
export const dailyRequestCeiling = 20;

const oneDayInMilliseconds = 86_400_000;

export async function countRequestsRaisedToday(
	supabase: SupabaseClient,
	contactId: string
): Promise<number> {
	const since = new Date(Date.now() - oneDayInMilliseconds).toISOString();
	const { count, error } = await supabase
		.from('feature_requests')
		.select('id', { count: 'exact', head: true })
		.eq('raised_by_contact_id', contactId)
		.gte('created_at', since);
	if (error) throw error;
	return count ?? 0;
}
