import { AdditiveBlending, MeshBasicMaterial, SpriteMaterial, type Texture } from 'three';

const FULL_CORE_OPACITY = 1;
const FULL_GLOW_OPACITY = 0.85;
const DIMMED_OPACITY_SHARE = 0.15;

export const WHOLE_MODEL_KEY = 'model';

type BankEntry = {
	material: MeshBasicMaterial | SpriteMaterial;
	contextKey: string;
	fullOpacity: number;
};

export type MaterialBank = {
	coreFor: (colour: number, contextKey: string) => MeshBasicMaterial;
	glowFor: (colour: number, contextKey: string) => SpriteMaterial;
	setFocus: (contextKey: string | null) => void;
	dispose: () => void;
};

export function createMaterialBank(glowTexture: Texture): MaterialBank {
	const entries = new Map<string, BankEntry>();

	function remember<MaterialType extends MeshBasicMaterial | SpriteMaterial>(
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

	function coreFor(colour: number, contextKey: string): MeshBasicMaterial {
		return remember(
			`core:${contextKey}:${colour}`,
			contextKey,
			FULL_CORE_OPACITY,
			() => new MeshBasicMaterial({ color: colour, transparent: true })
		);
	}

	function glowFor(colour: number, contextKey: string): SpriteMaterial {
		return remember(
			`glow:${contextKey}:${colour}`,
			contextKey,
			FULL_GLOW_OPACITY,
			() =>
				new SpriteMaterial({
					map: glowTexture,
					color: colour,
					transparent: true,
					opacity: FULL_GLOW_OPACITY,
					blending: AdditiveBlending,
					depthWrite: false
				})
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

	function dispose(): void {
		for (const entry of entries.values()) entry.material.dispose();
		entries.clear();
	}

	return { coreFor, glowFor, setFocus, dispose };
}
