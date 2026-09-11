import type { SupabaseClient } from '@supabase/supabase-js';

export const dailyRaiseCeiling = 20;

const oneDayInMilliseconds = 86_400_000;

export async function countSupportTasksRaisedToday(
	supabase: SupabaseClient,
	accountId: string
): Promise<number> {
	const since = new Date(Date.now() - oneDayInMilliseconds).toISOString();
	const { count, error } = await supabase
		.from('tasks')
		.select('id', { count: 'exact', head: true })
		.eq('created_by', accountId)
		.eq('kind', 'support')
		.gte('created_at', since);
	if (error) throw error;
	return count ?? 0;
}
