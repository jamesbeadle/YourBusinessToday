import type { SupabaseClient } from '@supabase/supabase-js';
import {
	parseNotificationRow,
	type NotificationListItem
} from '$lib/server/notifications/notificationListItem';

const notificationPageSize = 50;

export async function getNotificationList(
	supabase: SupabaseClient,
	recipientId: string
): Promise<NotificationListItem[]> {
	const { data, error } = await supabase
		.from('notifications')
		.select('*, tasks(title, project_id), task_comments(body, author_id)')
		.eq('recipient_id', recipientId)
		.order('created_at', { ascending: false })
		.limit(notificationPageSize);
	if (error) throw error;
	return data.map(parseNotificationRow);
}
