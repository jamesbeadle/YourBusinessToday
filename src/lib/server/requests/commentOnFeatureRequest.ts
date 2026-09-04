import type { SupabaseClient } from '@supabase/supabase-js';

export async function commentOnFeatureRequest(
	supabase: SupabaseClient,
	requestId: string,
	authorAccountId: string,
	body: string
): Promise<void> {
	const { error } = await supabase
		.from('feature_request_comments')
		.insert({ request_id: requestId, author_account_id: authorAccountId, body });
	if (error) throw error;
}
