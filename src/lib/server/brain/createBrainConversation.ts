import type { SupabaseClient } from '@supabase/supabase-js';
import type { BrainConversationChannel } from '$lib/data/brainTypes';

export async function createBrainConversation(
	supabase: SupabaseClient,
	brainId: string,
	channel: BrainConversationChannel
): Promise<string> {
	const { data, error } = await supabase
		.from('brain_conversations')
		.insert({ brain_id: brainId, channel })
		.select('id')
		.single();
	if (error !== null) throw error;
	return data.id;
}
