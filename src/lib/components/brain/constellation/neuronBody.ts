import {
	Group,
	LineSegments,
	Mesh,
	type BufferGeometry,
	type MeshBasicMaterial,
	type Vector3
} from 'three';
import { createCellSoma } from './cellSoma';
import { growDendrites } from './dendriteBranching';
import { clampShare, flare } from './growthShares';
import { revealWireframe, wireframeFrom } from './neuronWireframe';
import { shareStreamFrom } from './pseudoRandom';
import type { BodyProportions } from './neuronProportions';
import type { MaterialBank } from './materialBank';
import type { CellSkinBank } from './cellSkinBank';

const DENDRITE_OPACITY = 0.7;
const SOMA_PHASE_END = 0.4;
const DENDRITE_PHASE_START = 0.25;

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
	membraneGeometry: BufferGeometry;
	hitGeometry: BufferGeometry;
	hitMaterial: MeshBasicMaterial;
	bank: MaterialBank;
	skins: CellSkinBank;
	userData: Record<string, string>;
};

export function createNeuronBody(seed: BodySeed): NeuronBody {
	const { position, colour, contextKey, proportions, bank } = seed;
	const nextShare = shareStreamFrom(seed.slug);

	const soma = createCellSoma({
		slug: seed.slug,
		position,
		colour,
		contextKey,
		proportions,
		connectionDirections: seed.connectionDirections,
		somaGeometry: seed.somaGeometry,
		membraneGeometry: seed.membraneGeometry,
		bank,
		skins: seed.skins
	});

	const branches = growDendrites(seed.slug, seed.connectionDirections, proportions, nextShare);
	const wireframe = wireframeFrom(branches, position);
	const dendrites = new LineSegments(
		wireframe.geometry,
		bank.dendriteFor(colour, contextKey, DENDRITE_OPACITY)
	);

	const hitTarget = new Mesh(seed.hitGeometry, seed.hitMaterial);
	hitTarget.position.copy(position);
	hitTarget.scale.setScalar(proportions.hitRadius);
	hitTarget.userData = seed.userData;

	const group = new Group();
	group.add(soma.core, soma.membrane, soma.glow, dendrites, hitTarget);

	function setGrowth(share: number): void {
		soma.setGrowth(flare(clampShare(share / SOMA_PHASE_END)));
		const dendriteShare = clampShare((share - DENDRITE_PHASE_START) / (1 - DENDRITE_PHASE_START));
		revealWireframe(wireframe, dendriteShare);
	}

	return {
		group,
		hitTarget,
		position,
		colour,
		twinklePhase: position.x + position.y * 7,
		setGrowth,
		glowPulse: soma.glowPulse,
		dispose: () => wireframe.geometry.dispose()
	};
}
