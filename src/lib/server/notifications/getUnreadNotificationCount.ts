import type { SupabaseClient } from '@supabase/supabase-js';

export async function getUnreadNotificationCount(
	supabase: SupabaseClient,
	recipientId: string
): Promise<number> {
	const { count, error } = await supabase
		.from('notifications')
		.select('id', { count: 'exact', head: true })
		.eq('recipient_id', recipientId)
		.eq('is_read', false);
	if (error) throw error;
	return count ?? 0;
}
