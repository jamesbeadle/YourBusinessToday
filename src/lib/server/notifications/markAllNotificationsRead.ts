import type { SupabaseClient } from '@supabase/supabase-js';

export async function markAllNotificationsRead(
	supabase: SupabaseClient,
	recipientId: string
): Promise<void> {
	const { error } = await supabase
		.from('notifications')
		.update({ is_read: true })
		.eq('recipient_id', recipientId)
		.eq('is_read', false);
	if (error) throw error;
}
