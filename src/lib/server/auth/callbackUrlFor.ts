const defaultDestination = '/knowledge-base';

// Only same-site paths ride through the OAuth round trip; anything else
// (or nothing) lands on the workspace. The callback checks again on return.
export function callbackUrlFor(origin: string, destination: string | null): string {
	const isLocalPath =
		destination !== null && destination.startsWith('/') && !destination.startsWith('//');
	const next = isLocalPath ? destination : defaultDestination;
	return `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
}
