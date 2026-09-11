export type ConversationMessage = {
	id: string;
	goalId: string | null;
	taskId: string | null;
	authorAccountId: string;
	body: string;
	isInternal: boolean;
	createdAt: string;
};

export const messageColumns = 'id, goal_id, task_id, author_account_id, body, is_internal, created_at';

export function parseMessageRecord(row: Record<string, unknown>): ConversationMessage {
	return {
		id: row.id as string,
		goalId: (row.goal_id as string) ?? null,
		taskId: (row.task_id as string) ?? null,
		authorAccountId: row.author_account_id as string,
		body: row.body as string,
		isInternal: row.is_internal === true,
		createdAt: row.created_at as string
	};
}
