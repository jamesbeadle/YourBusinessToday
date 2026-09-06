import type { Coordinates } from '$lib/data/distance';
import { outcodeOf, postcodeIn } from '$lib/data/postcode';

export type PostcodeLocation = Coordinates & { postcode: string; outcode: string };

export function parsePostcodeLocation(value: unknown): PostcodeLocation | null {
	if (typeof value !== 'object' || value === null) return null;
	const result = value as Record<string, unknown>;
	const postcode = postcodeIn(String(result.postcode ?? ''));
	const latitude = Number(result.latitude);
	const longitude = Number(result.longitude);
	if (postcode === '' || Number.isNaN(latitude) || Number.isNaN(longitude)) return null;
	return { postcode, outcode: String(result.outcode ?? outcodeOf(postcode)), latitude, longitude };
}
