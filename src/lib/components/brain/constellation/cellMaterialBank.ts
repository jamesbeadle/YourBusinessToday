import type { IUniform, Material } from 'three';
import { createSharedCellUniforms } from './cellShading';
import { FibreMaterial, type FibreTints } from './fibreMaterial';
import { DIMMED_OPACITY_SHARE } from './materialBank';
import { SomaMaterial } from './somaMaterial';

const IN_FOCUS_SHARE = 1;

type CellEntry = { material: Material; contextKey: string };

export type CellMaterialBank = {
	somaFor: (colour: number, contextKey: string) => SomaMaterial;
	dendritesFor: (slug: string, colour: number, contextKey: string) => FibreMaterial;
	axonFor: (strandKey: string, tints: FibreTints, contextKey: string) => FibreMaterial;
	setFocus: (contextKey: string | null) => void;
	tick: (timeSeconds: number) => void;
	fitToViewport: (heightPixels: number) => void;
	dispose: () => void;
};

export function createCellMaterialBank(): CellMaterialBank {
	const shared = createSharedCellUniforms();
	const entries = new Map<string, CellEntry>();
	const dimSharesByContext = new Map<string, IUniform<number>>();

	function dimShareFor(contextKey: string): IUniform<number> {
		const known = dimSharesByContext.get(contextKey);
		if (known !== undefined) return known;
		const dimShare = { value: IN_FOCUS_SHARE };
		dimSharesByContext.set(contextKey, dimShare);
		return dimShare;
	}

	function remember<MaterialType extends Material>(
		key: string,
		contextKey: string,
		create: () => MaterialType
	): MaterialType {
		const existing = entries.get(key);
		if (existing !== undefined) return existing.material as MaterialType;
		const material = create();
		entries.set(key, { material, contextKey });
		return material;
	}

	function somaFor(colour: number, contextKey: string): SomaMaterial {
		return remember(`soma:${contextKey}:${colour}`, contextKey, () => {
			return new SomaMaterial(colour, shared, dimShareFor(contextKey));
		});
	}

	function dendritesFor(slug: string, colour: number, contextKey: string): FibreMaterial {
		return remember(`dendrites:${slug}:${colour}`, contextKey, () => {
			const tints = { root: colour, span: colour, tip: colour };
			return new FibreMaterial(tints, 'rootedInSoma', shared, dimShareFor(contextKey));
		});
	}

	function axonFor(strandKey: string, tints: FibreTints, contextKey: string): FibreMaterial {
		return remember(`axon:${strandKey}:${tints.root}:${tints.tip}`, contextKey, () => {
			return new FibreMaterial(tints, 'anchoredAtBothEnds', shared, dimShareFor(contextKey));
		});
	}

	function setFocus(contextKey: string | null): void {
		for (const [key, dimShare] of dimSharesByContext) {
			const isInFocus = contextKey === null || key === contextKey;
			dimShare.value = isInFocus ? IN_FOCUS_SHARE : DIMMED_OPACITY_SHARE;
		}
		for (const entry of entries.values()) {
			const isInFocus = contextKey === null || entry.contextKey === contextKey;
			entry.material.transparent = !isInFocus;
			entry.material.depthWrite = isInFocus;
		}
	}

	function tick(timeSeconds: number): void {
		shared.timeSeconds.value = timeSeconds;
	}

	function fitToViewport(heightPixels: number): void {
		shared.viewportHeightPixels.value = Math.max(1, heightPixels);
	}

	function dispose(): void {
		for (const entry of entries.values()) entry.material.dispose();
		entries.clear();
	}

	return { somaFor, dendritesFor, axonFor, setFocus, tick, fitToViewport, dispose };
}
