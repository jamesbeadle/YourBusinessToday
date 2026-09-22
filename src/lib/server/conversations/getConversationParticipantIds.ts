import type { SupabaseClient } from '@supabase/supabase-js';
import { subjectFilter, type ConversationSubject } from './conversationSubject';

export async function getConversationParticipantIds(
	supabase: SupabaseClient,
	subject: ConversationSubject
): Promise<string[]> {
	const { column, id } = subjectFilter(subject);
	const { data, error } = await supabase
		.from('conversation_participants')
		.select('account_id')
		.eq(column, id)
		.order('joined_at', { ascending: true });
	if (error) throw error;
	return data.map((row: Record<string, unknown>) => row.account_id as string);
}
