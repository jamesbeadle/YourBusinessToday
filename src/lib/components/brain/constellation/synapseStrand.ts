import {
	BufferGeometry,
	Line,
	QuadraticBezierCurve3,
	Vector3,
	type LineBasicMaterial
} from 'three';
import type { Synapse } from './constellationTypes';

const POINTS_PER_CURVE = 14;
const DENDRITE_BOW = 0.14;
const CROSSLINK_BOW = 1.12;
const LONGEST_REACH_SHARE = 0.35;

export type SynapseStrand = {
	line: Line;
	points: Vector3[];
	contextKey: string;
	touches: (slug: string) => boolean;
	orientFrom: (slug: string) => void;
	setGrowth: (share: number) => void;
	dispose: () => void;
};

export function createSynapseStrand(
	synapse: Synapse,
	contextKey: string,
	material: LineBasicMaterial,
	reachFor: (slug: string) => number
): SynapseStrand {
	const control = bowControlPoint(synapse);
	const from = pulledTowards(synapse.from, control, boundedReach(synapse, synapse.fromSlug, reachFor));
	const to = pulledTowards(synapse.to, control, boundedReach(synapse, synapse.toSlug, reachFor));
	const points = new QuadraticBezierCurve3(from, control, to).getPoints(POINTS_PER_CURVE);
	const geometry = new BufferGeometry().setFromPoints(points);
	const line = new Line(geometry, material);

	function orientFrom(slug: string): void {
		if (slug !== synapse.toSlug) return;
		points.reverse();
		geometry.setFromPoints(points);
	}

	function setGrowth(share: number): void {
		geometry.setDrawRange(0, Math.round(points.length * share));
	}

	return {
		line,
		points,
		contextKey,
		touches: (slug) => slug === synapse.fromSlug || slug === synapse.toSlug,
		orientFrom,
		setGrowth,
		dispose: () => geometry.dispose()
	};
}

function boundedReach(
	synapse: Synapse,
	slug: string,
	reachFor: (slug: string) => number
): number {
	const span = synapse.from.distanceTo(synapse.to);
	return Math.min(reachFor(slug), span * LONGEST_REACH_SHARE);
}

function pulledTowards(endpoint: Vector3, control: Vector3, reach: number): Vector3 {
	const heading = control.clone().sub(endpoint);
	if (heading.lengthSq() === 0) return endpoint.clone();
	return endpoint.clone().addScaledVector(heading.normalize(), reach);
}

function bowControlPoint(synapse: Synapse): Vector3 {
	const midpoint = synapse.from.clone().add(synapse.to).multiplyScalar(0.5);
	if (synapse.kind === 'crosslink') return midpoint.multiplyScalar(CROSSLINK_BOW);
	const lift = synapse.to.clone().sub(synapse.from).length() * DENDRITE_BOW;
	return midpoint.add(new Vector3(0, lift, 0));
}
