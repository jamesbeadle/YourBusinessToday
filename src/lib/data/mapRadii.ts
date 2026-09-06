export type RadiusMiles = 1 | 3 | 5 | 10 | 15;

export const radiusOrder: RadiusMiles[] = [1, 3, 5, 10, 15];

export const defaultRadiusMiles: RadiusMiles = 3;

const metresPerMile = 1609.344;

export function parseRadiusMiles(value: unknown): RadiusMiles {
	const requested = Number(value);
	const radius = radiusOrder.find((candidate) => candidate === requested);
	if (radius === undefined) return defaultRadiusMiles;
	return radius;
}

export function milesToMetres(miles: number): number {
	return Math.round(miles * metresPerMile);
}
