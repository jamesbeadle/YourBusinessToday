import type { SupabaseClient } from '@supabase/supabase-js';
import type { BrainConversationChannel } from '$lib/data/brainTypes';

export async function createBrainConversation(
	supabase: SupabaseClient,
	channel: BrainConversationChannel
): Promise<string> {
	const { data, error } = await supabase
		.from('brain_conversations')
		.insert({ channel })
		.select('id')
		.single();
	if (error !== null) throw error;
	return data.id;
}
