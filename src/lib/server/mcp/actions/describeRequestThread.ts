import { formatBritishDate } from '$lib/data/britishDate';
import type { RequestComment } from '$lib/server/requests/getRequestComments';

export function describeRequestThread(comments: RequestComment[]): string {
	if (comments.length === 0) return 'No replies yet.';
	return comments.map(describeComment).join('\n');
}

function describeComment(comment: RequestComment): string {
	return `${formatBritishDate(comment.createdAt)}: ${comment.body}`;
}
