import {
	AdditiveBlending,
	LineBasicMaterial,
	MeshBasicMaterial,
	SpriteMaterial,
	type Texture
} from 'three';

const FULL_GLOW_OPACITY = 0.55;

export const DIMMED_OPACITY_SHARE = 0.15;

export const WHOLE_MODEL_KEY = 'model';

type BankMaterial = MeshBasicMaterial | SpriteMaterial | LineBasicMaterial;

type BankEntry = {
	material: BankMaterial;
	contextKey: string;
	fullOpacity: number;
};

export type MaterialBank = {
	dendriteFor: (colour: number, contextKey: string, fullOpacity: number) => LineBasicMaterial;
	glowFor: (colour: number, contextKey: string) => SpriteMaterial;
	strandFor: (colour: number, contextKey: string, fullOpacity: number) => LineBasicMaterial;
	setFocus: (contextKey: string | null) => void;
	dispose: () => void;
};

export function createMaterialBank(glowTexture: Texture): MaterialBank {
	const entries = new Map<string, BankEntry>();

	function remember<MaterialType extends BankMaterial>(
		key: string,
		contextKey: string,
		fullOpacity: number,
		create: () => MaterialType
	): MaterialType {
		const existing = entries.get(key);
		if (existing !== undefined) return existing.material as MaterialType;
		const material = create();
		entries.set(key, { material, contextKey, fullOpacity });
		return material;
	}

	function dendriteFor(colour: number, contextKey: string, fullOpacity: number): LineBasicMaterial {
		return remember(`dendrite:${contextKey}:${colour}:${fullOpacity}`, contextKey, fullOpacity, () => {
			return new LineBasicMaterial({
				color: colour,
				vertexColors: true,
				transparent: true,
				opacity: fullOpacity,
				blending: AdditiveBlending,
				depthWrite: false
			});
		});
	}

	function glowFor(colour: number, contextKey: string): SpriteMaterial {
		return remember(`glow:${contextKey}:${colour}`, contextKey, FULL_GLOW_OPACITY, () => {
			return new SpriteMaterial({
				map: glowTexture,
				color: colour,
				transparent: true,
				opacity: FULL_GLOW_OPACITY,
				blending: AdditiveBlending,
				depthWrite: false
			});
		});
	}

	function strandFor(colour: number, contextKey: string, fullOpacity: number): LineBasicMaterial {
		return remember(`strand:${contextKey}:${colour}:${fullOpacity}`, contextKey, fullOpacity, () => {
			return new LineBasicMaterial({
				color: colour,
				transparent: true,
				opacity: fullOpacity,
				blending: AdditiveBlending,
				depthWrite: false
			});
		});
	}

	function setFocus(contextKey: string | null): void {
		for (const entry of entries.values()) {
			const isInFocus = contextKey === null || entry.contextKey === contextKey;
			entry.material.opacity = isInFocus
				? entry.fullOpacity
				: entry.fullOpacity * DIMMED_OPACITY_SHARE;
		}
	}

	function dispose(): void {
		for (const entry of entries.values()) entry.material.dispose();
		entries.clear();
	}

	return { dendriteFor, glowFor, strandFor, setFocus, dispose };
}
