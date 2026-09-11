import type { SupabaseClient } from '@supabase/supabase-js';
import { subjectColumns, type ConversationSubject } from './conversationSubject';

export const longestMessageBody = 4000;

export async function postMessage(
	supabase: SupabaseClient,
	subject: ConversationSubject,
	authorAccountId: string,
	body: string,
	isInternal: boolean
): Promise<void> {
	const { error } = await supabase.from('conversation_messages').insert({
		...subjectColumns(subject),
		author_account_id: authorAccountId,
		body,
		is_internal: isInternal
	});
	if (error) throw error;
}
