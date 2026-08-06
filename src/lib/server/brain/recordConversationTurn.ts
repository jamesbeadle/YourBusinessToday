import type { SupabaseClient } from '@supabase/supabase-js';
import type { BrainAnswer } from '$lib/data/brainTypes';

export async function recordConversationTurn(
	supabase: SupabaseClient,
	conversationId: string,
	question: string,
	answer: BrainAnswer
): Promise<void> {
	const { error } = await supabase.from('brain_messages').insert([
		{ conversation_id: conversationId, speaker: 'user', body: question },
		{
			conversation_id: conversationId,
			speaker: 'modeller',
			body: answer.answerMarkdown,
			cited_slugs: answer.citedSlugs
		}
	]);
	if (error !== null) throw error;
	await touchConversation(supabase, conversationId);
}

async function touchConversation(
	supabase: SupabaseClient,
	conversationId: string
): Promise<void> {
	const { error } = await supabase
		.from('brain_conversations')
		.update({ last_message_at: new Date().toISOString() })
		.eq('id', conversationId);
	if (error !== null) throw error;
}
