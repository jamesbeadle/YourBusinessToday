import { formatBritishDate } from '$lib/data/britishDate';
import { withAuthorNames } from '$lib/server/conversations/withAuthorNames';
import type { Account } from '$lib/server/accounts/accountRecord';
import type { ConversationMessage } from '$lib/server/conversations/messageRecord';

export function threadLines(messages: ConversationMessage[], accounts: Account[]): string[] {
	if (messages.length === 0) return ['Conversation: nothing said yet.'];
	return ['Conversation:', ...withAuthorNames(messages, accounts).map(messageLine)];
}

function messageLine(message: ConversationMessage & { authorName: string }): string {
	const audience = message.isInternal ? ' [internal]' : '';
	return `- ${message.authorName}${audience}, ${formatBritishDate(message.createdAt)}: ${message.body}`;
}
