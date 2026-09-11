import type { SupabaseClient } from '@supabase/supabase-js';
import { getMemberProjectIds } from '$lib/server/members/getMemberProjectIds';
import { homeDestinationFor } from './localDestination';

const clientPortal = '/portal';

export async function destinationAfterPasswordSet(
	supabase: SupabaseClient,
	accountId: string
): Promise<string> {
	const memberProjectIds = await getMemberProjectIds(supabase, accountId);
	const isProjectMember = memberProjectIds.length > 0;
	if (isProjectMember) return clientPortal;
	return homeDestinationFor(supabase, accountId);
}
