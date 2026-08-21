import {
	Group,
	LineSegments,
	Mesh,
	Sprite,
	Vector3,
	type BufferGeometry,
	type MeshBasicMaterial
} from 'three';
import { growDendrites } from './dendriteBranching';
import { clampShare, flare } from './growthShares';
import { revealWireframe, wireframeFrom } from './neuronWireframe';
import { shareStreamFrom } from './pseudoRandom';
import type { BodyProportions } from './neuronProportions';
import type { MaterialBank } from './materialBank';

const DENDRITE_OPACITY = 0.55;
const SOMA_SQUASH_SPREAD = 0.35;
const SOMA_PHASE_END = 0.4;
const DENDRITE_PHASE_START = 0.25;
const FULL_TURN_RADIANS = Math.PI * 2;

export type NeuronBody = {
	group: Group;
	hitTarget: Mesh;
	position: Vector3;
	colour: number;
	twinklePhase: number;
	setGrowth: (share: number) => void;
	glowPulse: (pulse: number) => void;
	dispose: () => void;
};

export type BodySeed = {
	slug: string;
	position: Vector3;
	colour: number;
	contextKey: string;
	proportions: BodyProportions;
	connectionDirections: Vector3[];
	somaGeometry: BufferGeometry;
	hitMaterial: MeshBasicMaterial;
	bank: MaterialBank;
	userData: Record<string, string>;
};

export function createNeuronBody(seed: BodySeed): NeuronBody {
	const { position, colour, contextKey, proportions, bank } = seed;
	const nextShare = shareStreamFrom(seed.slug);

	const soma = new Mesh(seed.somaGeometry, bank.coreFor(colour, contextKey));
	soma.position.copy(position);
	soma.rotation.set(spin(nextShare), spin(nextShare), spin(nextShare));
	const somaShape = irregularShape(proportions.somaRadius, nextShare);
	soma.scale.copy(somaShape);

	const glow = new Sprite(bank.glowFor(colour, contextKey));
	glow.position.copy(position);
	glow.scale.setScalar(proportions.glowScale);

	const branches = growDendrites(seed.connectionDirections, proportions, nextShare);
	const wireframe = wireframeFrom(branches, position);
	const dendrites = new LineSegments(
		wireframe.geometry,
		bank.strandFor(colour, contextKey, DENDRITE_OPACITY)
	);

	const hitTarget = new Mesh(seed.somaGeometry, seed.hitMaterial);
	hitTarget.position.copy(position);
	hitTarget.scale.setScalar(proportions.hitRadius);
	hitTarget.userData = seed.userData;

	const group = new Group();
	group.add(soma, glow, dendrites, hitTarget);
	let flareShare = 1;

	function setGrowth(share: number): void {
		flareShare = flare(clampShare(share / SOMA_PHASE_END));
		soma.scale.copy(somaShape).multiplyScalar(flareShare);
		const dendriteShare = clampShare((share - DENDRITE_PHASE_START) / (1 - DENDRITE_PHASE_START));
		revealWireframe(wireframe, dendriteShare);
	}

	function glowPulse(pulse: number): void {
		glow.scale.setScalar(proportions.glowScale * flareShare * pulse);
	}

	const twinklePhase = position.x + position.y * 7;
	const dispose = () => wireframe.geometry.dispose();
	return { group, hitTarget, position, colour, twinklePhase, setGrowth, glowPulse, dispose };
}

function irregularShape(radius: number, nextShare: () => number): Vector3 {
	const stretch = () => radius * (1 - SOMA_SQUASH_SPREAD / 2 + SOMA_SQUASH_SPREAD * nextShare());
	return new Vector3(stretch(), stretch(), stretch());
}

function spin(nextShare: () => number): number {
	return nextShare() * FULL_TURN_RADIANS;
}
