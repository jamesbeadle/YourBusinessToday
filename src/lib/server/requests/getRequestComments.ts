import type { SupabaseClient } from '@supabase/supabase-js';

export type RequestComment = {
	id: string;
	authorAccountId: string;
	body: string;
	createdAt: string;
};

export async function getRequestComments(
	supabase: SupabaseClient,
	requestId: string
): Promise<RequestComment[]> {
	const { data, error } = await supabase
		.from('feature_request_comments')
		.select('id, author_account_id, body, created_at')
		.eq('request_id', requestId)
		.order('created_at');
	if (error) throw error;
	return data.map((row: Record<string, unknown>) => ({
		id: row.id as string,
		authorAccountId: row.author_account_id as string,
		body: row.body as string,
		createdAt: row.created_at as string
	}));
}
