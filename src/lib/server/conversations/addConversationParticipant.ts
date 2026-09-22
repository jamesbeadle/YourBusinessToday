import type { SupabaseClient } from '@supabase/supabase-js';
import { subjectColumns, type ConversationSubject } from './conversationSubject';

export async function addConversationParticipant(
	supabase: SupabaseClient,
	subject: ConversationSubject,
	accountId: string
): Promise<void> {
	const { error } = await supabase
		.from('conversation_participants')
		.upsert(
			{ ...subjectColumns(subject), account_id: accountId },
			{ onConflict: 'goal_id,task_id,account_id', ignoreDuplicates: true }
		);
	if (error) throw error;
}
