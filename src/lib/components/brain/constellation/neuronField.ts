import { Group, IcosahedronGeometry, Mesh, MeshBasicMaterial, Sprite } from 'three';
import { CHALK, SIGNAL, kindColours } from './constellationPalette';
import { WHOLE_MODEL_KEY, type MaterialBank } from './materialBank';
import type { ConstellationModel, Neuron, Nucleus } from './constellationTypes';

const NEURON_CORE_RADIUS = 0.09;
const NEURON_GLOW_SCALE = 0.55;
const NEURON_HIT_RADIUS = 0.32;
const NUCLEUS_CORE_RADIUS = 0.34;
const NUCLEUS_GLOW_SCALE = 2.4;
const NUCLEUS_HIT_RADIUS = 0.75;
const TWINKLE_SHARE = 0.18;
const TWINKLE_SPEED = 1.6;

type Twinkler = { sprite: Sprite; baseScale: number; phase: number };

export type NeuronField = {
	group: Group;
	hitTargets: Mesh[];
	twinkle: (timeSeconds: number) => void;
	dispose: () => void;
};

export function createNeuronField(model: ConstellationModel, bank: MaterialBank): NeuronField {
	const group = new Group();
	const hitTargets: Mesh[] = [];
	const twinklers: Twinkler[] = [];
	const coreGeometry = new IcosahedronGeometry(1, 3);
	const hitMaterial = new MeshBasicMaterial({ visible: false });

	function addOrb(
		position: Neuron['position'],
		colour: number,
		contextKey: string,
		coreRadius: number,
		glowScale: number,
		hitRadius: number,
		userData: Record<string, string>
	): void {
		const core = new Mesh(coreGeometry, bank.coreFor(colour, contextKey));
		core.position.copy(position);
		core.scale.setScalar(coreRadius);
		const glow = new Sprite(bank.glowFor(colour, contextKey));
		glow.position.copy(position);
		glow.scale.setScalar(glowScale);
		const hit = new Mesh(coreGeometry, hitMaterial);
		hit.position.copy(position);
		hit.scale.setScalar(hitRadius);
		hit.userData = userData;
		group.add(core, glow, hit);
		hitTargets.push(hit);
		twinklers.push({ sprite: glow, baseScale: glowScale, phase: position.x + position.y * 7 });
	}

	function addNeuron(neuron: Neuron): void {
		const contextKey = neuron.contextSlug ?? WHOLE_MODEL_KEY;
		addOrb(
			neuron.position,
			kindColours[neuron.kind],
			contextKey,
			NEURON_CORE_RADIUS,
			NEURON_GLOW_SCALE,
			NEURON_HIT_RADIUS,
			{ neuronSlug: neuron.slug }
		);
	}

	function addNucleus(nucleus: Nucleus): void {
		const colour = nucleus.isCoreDomain ? SIGNAL : CHALK;
		addOrb(
			nucleus.position,
			colour,
			nucleus.slug,
			NUCLEUS_CORE_RADIUS,
			NUCLEUS_GLOW_SCALE,
			NUCLEUS_HIT_RADIUS,
			{ nucleusSlug: nucleus.slug }
		);
	}

	model.neurons.forEach(addNeuron);
	model.nuclei.forEach(addNucleus);

	function twinkle(timeSeconds: number): void {
		for (const twinkler of twinklers) {
			const pulse = 1 + TWINKLE_SHARE * Math.sin(timeSeconds * TWINKLE_SPEED + twinkler.phase);
			twinkler.sprite.scale.setScalar(twinkler.baseScale * pulse);
		}
	}

	function dispose(): void {
		coreGeometry.dispose();
		hitMaterial.dispose();
	}

	return { group, hitTargets, twinkle, dispose };
}
