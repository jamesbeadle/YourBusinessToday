import { accountNameLookup } from '$lib/data/accountNames';
import type { Account } from '$lib/server/accounts/accountRecord';
import type { ConversationMessage } from './messageRecord';

export type NamedMessage = ConversationMessage & { authorName: string };

export function withAuthorNames(
	messages: ConversationMessage[],
	accounts: Account[]
): NamedMessage[] {
	const nameOf = accountNameLookup(accounts);
	return messages.map((message) => ({ ...message, authorName: nameOf(message.authorAccountId) }));
}
