import type { SupabaseClient } from '@supabase/supabase-js';
import { subjectFilter, type ConversationSubject } from './conversationSubject';
import { messageColumns, parseMessageRecord, type ConversationMessage } from './messageRecord';

export async function getThread(
	supabase: SupabaseClient,
	subject: ConversationSubject,
	shouldIncludeInternal: boolean
): Promise<ConversationMessage[]> {
	const { column, id } = subjectFilter(subject);
	let query = supabase.from('conversation_messages').select(messageColumns).eq(column, id);
	if (!shouldIncludeInternal) query = query.eq('is_internal', false);
	const { data, error } = await query.order('created_at', { ascending: true });
	if (error) throw error;
	return data.map(parseMessageRecord);
}
