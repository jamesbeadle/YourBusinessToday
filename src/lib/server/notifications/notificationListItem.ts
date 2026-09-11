export type NotificationListItem = {
	id: string;
	taskId: string;
	projectId: string;
	taskTitle: string;
	messageBody: string;
	messageAuthorId: string;
	isRead: boolean;
	createdAt: string;
};

type SaidBy = { body: string; authorId: string };

export function parseNotificationRow(row: Record<string, unknown>): NotificationListItem {
	const task = row.tasks as { title: string; project_id: string };
	const said = whatWasSaid(row);
	return {
		id: row.id as string,
		taskId: row.task_id as string,
		projectId: task.project_id,
		taskTitle: task.title,
		messageBody: said.body,
		messageAuthorId: said.authorId,
		isRead: row.is_read as boolean,
		createdAt: row.created_at as string
	};
}

function whatWasSaid(row: Record<string, unknown>): SaidBy {
	const message = row.conversation_messages as { body: string; author_account_id: string } | null;
	if (message !== null && message !== undefined) {
		return { body: message.body, authorId: message.author_account_id };
	}
	const comment = row.task_comments as { body: string; author_id: string } | null;
	return { body: comment?.body ?? '', authorId: comment?.author_id ?? '' };
}
