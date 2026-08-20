const FNV_OFFSET_BASIS = 2166136261;
const FNV_PRIME = 16777619;
const UNIT_RESOLUTION = 100000;

export function pseudoRandomFrom(seed: string): number {
	let hash = FNV_OFFSET_BASIS;
	for (const character of seed) {
		hash ^= character.charCodeAt(0);
		hash = Math.imul(hash, FNV_PRIME);
	}
	return ((hash >>> 0) % UNIT_RESOLUTION) / UNIT_RESOLUTION;
}
