import type { SupabaseClient } from '@supabase/supabase-js';

export async function markNotificationRead(
	supabase: SupabaseClient,
	notificationId: string
): Promise<void> {
	const { error } = await supabase
		.from('notifications')
		.update({ is_read: true })
		.eq('id', notificationId);
	if (error) throw error;
}
