import { getMemberProjectIds } from '$lib/server/members/getMemberProjectIds';
import type { SupabaseClient } from '@supabase/supabase-js';

export const defaultDestination = '/';
export const clientPortalDestination = '/portal';

/** Only a same-site path is safe to send someone to; anything else lands on the default. */
export function localDestinationOrDefault(destination: string | null): string {
	if (isLocalPath(destination)) return destination;
	return defaultDestination;
}

/** Where the signed-in session lands: the path it asked for, or its home. */
export async function destinationAfterSignIn(
	locals: App.Locals,
	requestedDestination: string | null
): Promise<string> {
	if (isLocalPath(requestedDestination)) return requestedDestination;
	const { user } = await locals.safeGetSession();
	if (user === null) return defaultDestination;
	return homeDestinationFor(locals.supabase, user.id);
}

/** The portal for a client's person; the front page for everyone else. */
export async function homeDestinationFor(supabase: SupabaseClient, userId: string): Promise<string> {
	const memberProjectIds = await getMemberProjectIds(supabase, userId);
	if (memberProjectIds.length > 0) return clientPortalDestination;
	return defaultDestination;
}

function isLocalPath(destination: string | null): destination is string {
	return destination !== null && destination.startsWith('/') && !destination.startsWith('//');
}
