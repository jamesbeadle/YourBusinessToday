import type { SupabaseClient } from '@supabase/supabase-js';

export async function addMapViewer(
	supabase: SupabaseClient,
	ownerId: string,
	viewerEmail: string
): Promise<void> {
	const { error } = await supabase
		.from('map_viewers')
		.insert({ owner_id: ownerId, viewer_email: viewerEmail.toLowerCase() });
	if (error) throw error;
}
