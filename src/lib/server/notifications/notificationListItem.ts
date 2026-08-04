export type NotificationListItem = {
	id: string;
	taskId: string;
	projectId: string;
	taskTitle: string;
	commentBody: string;
	commentAuthorId: string;
	isRead: boolean;
	createdAt: string;
};

export function parseNotificationRow(row: Record<string, unknown>): NotificationListItem {
	const task = row.tasks as { title: string; project_id: string };
	const comment = row.task_comments as { body: string; author_id: string };
	return {
		id: row.id as string,
		taskId: row.task_id as string,
		projectId: task.project_id,
		taskTitle: task.title,
		commentBody: comment.body,
		commentAuthorId: comment.author_id,
		isRead: row.is_read as boolean,
		createdAt: row.created_at as string
	};
}
