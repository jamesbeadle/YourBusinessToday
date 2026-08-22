import type { Vector3 } from 'three';
import { MembraneMaterial } from './membraneMaterial';
import { SomaMaterial } from './somaMaterial';
import { DIMMED_OPACITY_SHARE } from './materialBank';

const FULL_MEMBRANE_OPACITY = 0.85;
const FULL_SOMA_OPACITY = 1;

type SkinMaterial = MembraneMaterial | SomaMaterial;

type SkinEntry = { material: SkinMaterial; contextKey: string; fullOpacity: number };

export type CellSkinBank = {
	membraneFor: (slug: string, colour: number, contextKey: string, teatDirections: Vector3[]) => MembraneMaterial;
	somaFor: (colour: number, contextKey: string) => SomaMaterial;
	setFocus: (contextKey: string | null) => void;
	tick: (timeSeconds: number) => void;
	dispose: () => void;
};

export function createCellSkinBank(): CellSkinBank {
	const entries = new Map<string, SkinEntry>();

	function remember<MaterialType extends SkinMaterial>(
		key: string,
		contextKey: string,
		fullOpacity: number,
		create: () => MaterialType
	): MaterialType {
		const existing = entries.get(key);
		if (existing !== undefined) return existing.material as MaterialType;
		const material = create();
		material.opacity = fullOpacity;
		entries.set(key, { material, contextKey, fullOpacity });
		return material;
	}

	function membraneFor(
		slug: string,
		colour: number,
		contextKey: string,
		teatDirections: Vector3[]
	): MembraneMaterial {
		return remember(
			`membrane:${slug}`,
			contextKey,
			FULL_MEMBRANE_OPACITY,
			() => new MembraneMaterial(colour, teatDirections)
		);
	}

	function somaFor(colour: number, contextKey: string): SomaMaterial {
		return remember(
			`soma:${contextKey}:${colour}`,
			contextKey,
			FULL_SOMA_OPACITY,
			() => new SomaMaterial(colour)
		);
	}

	function setFocus(contextKey: string | null): void {
		for (const entry of entries.values()) {
			const isInFocus = contextKey === null || entry.contextKey === contextKey;
			entry.material.opacity = isInFocus
				? entry.fullOpacity
				: entry.fullOpacity * DIMMED_OPACITY_SHARE;
		}
	}

	function tick(timeSeconds: number): void {
		for (const entry of entries.values()) entry.material.setTime(timeSeconds);
	}

	function dispose(): void {
		for (const entry of entries.values()) entry.material.dispose();
		entries.clear();
	}

	return { membraneFor, somaFor, setFocus, tick, dispose };
}
