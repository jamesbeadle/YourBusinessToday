import { MembraneMaterial } from './membraneMaterial';
import { DIMMED_OPACITY_SHARE } from './materialBank';

const FULL_MEMBRANE_OPACITY = 0.85;

type MembraneEntry = { material: MembraneMaterial; contextKey: string };

export type MembraneBank = {
	membraneFor: (colour: number, contextKey: string) => MembraneMaterial;
	setFocus: (contextKey: string | null) => void;
	tick: (timeSeconds: number) => void;
	dispose: () => void;
};

export function createMembraneBank(): MembraneBank {
	const entries = new Map<string, MembraneEntry>();

	function membraneFor(colour: number, contextKey: string): MembraneMaterial {
		const key = `${contextKey}:${colour}`;
		const existing = entries.get(key);
		if (existing !== undefined) return existing.material;
		const material = new MembraneMaterial(colour);
		material.opacity = FULL_MEMBRANE_OPACITY;
		entries.set(key, { material, contextKey });
		return material;
	}

	function setFocus(contextKey: string | null): void {
		for (const entry of entries.values()) {
			const isInFocus = contextKey === null || entry.contextKey === contextKey;
			entry.material.opacity = isInFocus
				? FULL_MEMBRANE_OPACITY
				: FULL_MEMBRANE_OPACITY * DIMMED_OPACITY_SHARE;
		}
	}

	function tick(timeSeconds: number): void {
		for (const entry of entries.values()) entry.material.setTime(timeSeconds);
	}

	function dispose(): void {
		for (const entry of entries.values()) entry.material.dispose();
		entries.clear();
	}

	return { membraneFor, setFocus, tick, dispose };
}
