import type { DomainBlockKind } from '$lib/data/brainTypes';

export const NIGHT_SKY = 0x0b0e16;
export const CHALK = 0xeef1f8;
export const SIGNAL = 0xff4d5e;
export const STARLIGHT = 0x8a94b8;
export const DENDRITE = 0x3a4a78;
export const CROSSLINK = 0x5a6ba8;

export const kindColours: Record<DomainBlockKind, number> = {
	entity: 0x7da2ff,
	value_object: 0x2fd48a,
	aggregate: 0xffc861,
	domain_service: 0xb08cff,
	domain_event: 0xff8a5e,
	glossary: 0x5ee6e6,
	context_map: 0xeef1f8
};

export function asCssColour(colour: number): string {
	return `#${colour.toString(16).padStart(6, '0')}`;
}
