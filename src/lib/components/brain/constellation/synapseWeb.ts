import {
	AdditiveBlending,
	BufferGeometry,
	Group,
	LineBasicMaterial,
	LineSegments,
	QuadraticBezierCurve3,
	Vector3
} from 'three';
import { CROSSLINK, DENDRITE } from './constellationPalette';
import { WHOLE_MODEL_KEY } from './materialBank';
import type { Synapse } from './constellationTypes';

const POINTS_PER_CURVE = 14;
const DENDRITE_BOW = 0.18;
const CROSSLINK_BOW = 1.25;
const FULL_OPACITY = 0.4;
const DIMMED_OPACITY = 0.06;

export type SampledCurve = { points: Vector3[]; contextKey: string };

export type SynapseWeb = {
	group: Group;
	curves: SampledCurve[];
	setFocus: (contextKey: string | null) => void;
	dispose: () => void;
};

export function createSynapseWeb(synapses: Synapse[]): SynapseWeb {
	const group = new Group();
	const curves = synapses.map(sampleCurve);
	const materials = new Map<string, LineBasicMaterial>();

	for (const [contextKey, strand] of strandsByContext(curves)) {
		const colour = contextKey === WHOLE_MODEL_KEY ? CROSSLINK : DENDRITE;
		const material = new LineBasicMaterial({
			color: colour,
			transparent: true,
			opacity: FULL_OPACITY,
			blending: AdditiveBlending,
			depthWrite: false
		});
		materials.set(contextKey, material);
		const geometry = new BufferGeometry().setFromPoints(strand);
		group.add(new LineSegments(geometry, material));
	}

	function setFocus(contextKey: string | null): void {
		for (const [key, material] of materials) {
			const isInFocus = contextKey === null || key === contextKey;
			material.opacity = isInFocus ? FULL_OPACITY : DIMMED_OPACITY;
		}
	}

	function dispose(): void {
		for (const child of group.children) (child as LineSegments).geometry.dispose();
		for (const material of materials.values()) material.dispose();
	}

	return { group, curves, setFocus, dispose };
}

function sampleCurve(synapse: Synapse): SampledCurve {
	const control = bowControlPoint(synapse);
	const curve = new QuadraticBezierCurve3(synapse.from, control, synapse.to);
	return {
		points: curve.getPoints(POINTS_PER_CURVE),
		contextKey: synapse.contextSlug ?? WHOLE_MODEL_KEY
	};
}

function bowControlPoint(synapse: Synapse): Vector3 {
	const midpoint = synapse.from.clone().add(synapse.to).multiplyScalar(0.5);
	if (synapse.kind === 'crosslink') return midpoint.multiplyScalar(CROSSLINK_BOW);
	const lift = synapse.to.clone().sub(synapse.from).length() * DENDRITE_BOW;
	return midpoint.add(new Vector3(0, lift, 0));
}

function strandsByContext(curves: SampledCurve[]): Map<string, Vector3[]> {
	const strands = new Map<string, Vector3[]>();
	for (const curve of curves) {
		const strand = strands.get(curve.contextKey) ?? [];
		for (let index = 0; index < curve.points.length - 1; index += 1) {
			strand.push(curve.points[index], curve.points[index + 1]);
		}
		strands.set(curve.contextKey, strand);
	}
	return strands;
}
