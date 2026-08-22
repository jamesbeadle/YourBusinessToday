import { Mesh, Sprite, Vector3, type BufferGeometry } from 'three';
import { STRAND_DOCK_SHARE } from './membraneMaterial';
import { shareStreamFrom } from './pseudoRandom';
import type { BodyProportions } from './neuronProportions';
import type { MaterialBank } from './materialBank';
import type { CellSkinBank } from './cellSkinBank';

const CORE_RADIUS_SHARE = 0.6;
const MEMBRANE_RADIUS_SHARE = 1.5;
const SOMA_SQUASH_SPREAD = 0.35;
const FULL_TURN_RADIANS = Math.PI * 2;

export type CellSoma = {
	core: Mesh;
	membrane: Mesh;
	glow: Sprite;
	setGrowth: (flareShare: number) => void;
	glowPulse: (pulse: number) => void;
};

export type SomaSeed = {
	slug: string;
	position: Vector3;
	colour: number;
	contextKey: string;
	proportions: BodyProportions;
	connectionDirections: Vector3[];
	somaGeometry: BufferGeometry;
	membraneGeometry: BufferGeometry;
	bank: MaterialBank;
	skins: CellSkinBank;
};

export function membraneRadiusOf(slug: string, proportions: BodyProportions): number {
	return proportions.somaRadius * somaSizeShareOf(slug) * MEMBRANE_RADIUS_SHARE;
}

export function strandDockRadiusOf(slug: string, proportions: BodyProportions): number {
	return membraneRadiusOf(slug, proportions) * STRAND_DOCK_SHARE;
}

export function createCellSoma(seed: SomaSeed): CellSoma {
	const { slug, position, colour, contextKey, proportions, bank, skins } = seed;
	const somaRadius = proportions.somaRadius * somaSizeShareOf(slug);
	const nextShare = shareStreamFrom(`${slug}:soma`);

	const core = new Mesh(seed.somaGeometry, skins.somaFor(colour, contextKey));
	core.position.copy(position);
	core.rotation.set(spin(nextShare), spin(nextShare), spin(nextShare));

	const membrane = new Mesh(
		seed.membraneGeometry,
		skins.membraneFor(slug, colour, contextKey, seed.connectionDirections)
	);
	membrane.position.copy(position);

	const glow = new Sprite(bank.glowFor(colour, contextKey));
	glow.position.copy(position);

	let flareShare = 1;

	function resize(): void {
		core.scale.setScalar(somaRadius * CORE_RADIUS_SHARE * flareShare);
		membrane.scale.setScalar(somaRadius * MEMBRANE_RADIUS_SHARE * flareShare);
	}

	function setGrowth(grownFlareShare: number): void {
		flareShare = grownFlareShare;
		resize();
	}

	function glowPulse(pulse: number): void {
		glow.scale.setScalar(proportions.glowScale * flareShare * pulse);
	}

	resize();
	glowPulse(1);
	return { core, membrane, glow, setGrowth, glowPulse };
}

function somaSizeShareOf(slug: string): number {
	const share = shareStreamFrom(`${slug}:size`)();
	return 1 - SOMA_SQUASH_SPREAD / 2 + SOMA_SQUASH_SPREAD * share;
}

function spin(nextShare: () => number): number {
	return nextShare() * FULL_TURN_RADIANS;
}
