import { Mesh, Sprite, Vector3, type BufferGeometry } from 'three';
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
	position: Vector3;
	colour: number;
	contextKey: string;
	proportions: BodyProportions;
	somaGeometry: BufferGeometry;
	membraneGeometry: BufferGeometry;
	bank: MaterialBank;
	skins: CellSkinBank;
	nextShare: () => number;
};

export function createCellSoma(seed: SomaSeed): CellSoma {
	const { position, colour, contextKey, proportions, bank, skins, nextShare } = seed;
	const somaShape = irregularShape(proportions.somaRadius, nextShare);

	const core = new Mesh(seed.somaGeometry, skins.somaFor(colour, contextKey));
	core.position.copy(position);
	core.rotation.set(spin(nextShare), spin(nextShare), spin(nextShare));

	const membrane = new Mesh(seed.membraneGeometry, skins.membraneFor(colour, contextKey));
	membrane.position.copy(position);
	membrane.rotation.set(spin(nextShare), spin(nextShare), spin(nextShare));

	const glow = new Sprite(bank.glowFor(colour, contextKey));
	glow.position.copy(position);

	let flareShare = 1;

	function resize(): void {
		core.scale.copy(somaShape).multiplyScalar(CORE_RADIUS_SHARE * flareShare);
		membrane.scale.copy(somaShape).multiplyScalar(MEMBRANE_RADIUS_SHARE * flareShare);
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

function irregularShape(radius: number, nextShare: () => number): Vector3 {
	const stretch = () => radius * (1 - SOMA_SQUASH_SPREAD / 2 + SOMA_SQUASH_SPREAD * nextShare());
	return new Vector3(stretch(), stretch(), stretch());
}

function spin(nextShare: () => number): number {
	return nextShare() * FULL_TURN_RADIANS;
}
