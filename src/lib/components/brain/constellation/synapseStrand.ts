import {
	BufferAttribute,
	BufferGeometry,
	CubicBezierCurve3,
	Line,
	Vector3,
	type LineBasicMaterial
} from 'three';
import { shareStreamFrom } from './pseudoRandom';
import type { Synapse } from './constellationTypes';

const POINTS_PER_CURVE = 24;
const HANDLE_SHARE = 0.32;
const HANDLE_DRIFT = 0.3;
const CROSSLINK_OUTWARD_LIFT = 0.12;
const JOIN_BRIGHTNESS = 1;
const SPAN_BRIGHTNESS = 0.55;
const JOIN_FADE_SHARE = 0.2;

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
	membraneRadiusFor: (slug: string) => number
): SynapseStrand {
	const nextShare = shareStreamFrom(`${synapse.fromSlug}->${synapse.toSlug}`);
	const span = synapse.from.distanceTo(synapse.to);
	const leaving = drifted(synapse.to.clone().sub(synapse.from).normalize(), nextShare);
	const arriving = drifted(synapse.from.clone().sub(synapse.to).normalize(), nextShare);
	const start = synapse.from.clone().addScaledVector(leaving, membraneRadiusFor(synapse.fromSlug));
	const end = synapse.to.clone().addScaledVector(arriving, membraneRadiusFor(synapse.toSlug));
	const outwardLift = synapse.kind === 'crosslink' ? span * CROSSLINK_OUTWARD_LIFT : 0;
	const startHandle = handleFrom(start, leaving, span, outwardLift);
	const endHandle = handleFrom(end, arriving, span, outwardLift);
	const points = new CubicBezierCurve3(start, startHandle, endHandle, end).getPoints(POINTS_PER_CURVE);
	const geometry = new BufferGeometry().setFromPoints(points);
	geometry.setAttribute('color', new BufferAttribute(joinBrightness(points.length), 3));
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

function drifted(heading: Vector3, nextShare: () => number): Vector3 {
	const drift = new Vector3(nextShare() - 0.5, nextShare() - 0.5, nextShare() - 0.5);
	return heading.addScaledVector(drift, HANDLE_DRIFT).normalize();
}

function handleFrom(anchor: Vector3, heading: Vector3, span: number, outwardLift: number): Vector3 {
	const handle = anchor.clone().addScaledVector(heading, span * HANDLE_SHARE);
	if (outwardLift === 0) return handle;
	return handle.addScaledVector(handle.clone().normalize(), outwardLift);
}

function joinBrightness(pointCount: number): Float32Array {
	const brightness = new Float32Array(pointCount * 3);
	for (let index = 0; index < pointCount; index += 1) {
		const share = index / (pointCount - 1);
		const distanceFromJoin = Math.min(share, 1 - share) / JOIN_FADE_SHARE;
		const tone = JOIN_BRIGHTNESS + (SPAN_BRIGHTNESS - JOIN_BRIGHTNESS) * Math.min(1, distanceFromJoin);
		brightness.set([tone, tone, tone], index * 3);
	}
	return brightness;
}
