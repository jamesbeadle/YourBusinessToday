export const defaultDestination = '/knowledge-base';

/** Only a same-site path is safe to send someone to; anything else lands on the default. */
export function localDestinationOrDefault(destination: string | null): string {
	const isLocalPath =
		destination !== null && destination.startsWith('/') && !destination.startsWith('//');
	if (isLocalPath) return destination;
	return defaultDestination;
}
