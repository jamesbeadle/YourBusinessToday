import type { SupabaseClient } from '@supabase/supabase-js';
import { subjectFilter, type ConversationSubject } from './conversationSubject';

export async function removeConversationParticipant(
	supabase: SupabaseClient,
	subject: ConversationSubject,
	accountId: string
): Promise<void> {
	const { column, id } = subjectFilter(subject);
	const { error } = await supabase
		.from('conversation_participants')
		.delete()
		.eq(column, id)
		.eq('account_id', accountId);
	if (error) throw error;
}
