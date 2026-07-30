import { FacePalette } from './facePalette';
import type { ParticleCollection, ParticlePoint } from './particleCollection';

const SHOULDER_NODE_COUNT = 170;
const ACCENT_SHARE = 0.12;
const NECK_TOP = -1.1;
const DROP = 1.2;
const NECK_HALF_WIDTH = 0.34;
const SHOULDER_SPREAD = 2.1;

function shoulderPoint(): ParticlePoint {
	const descent = Math.pow(Math.random(), 0.75);
	const halfWidth = NECK_HALF_WIDTH + SHOULDER_SPREAD * Math.pow(descent, 1.4);
	const across = Math.random() * 2 - 1;
	return {
		x: across * halfWidth,
		y: NECK_TOP - DROP * descent,
		z: 0.3 * (1 - across * across) - 0.1 - 0.35 * descent
	};
}

export function buildShoulders(collection: ParticleCollection): ParticlePoint[] {
	const nodes: ParticlePoint[] = [];
	while (nodes.length < SHOULDER_NODE_COUNT) {
		const point = shoulderPoint();
		nodes.push(point);
		const isAccent = Math.random() < ACCENT_SHARE;
		const colour = isAccent ? FacePalette.ember : FacePalette.nodeGlow;
		collection.add(point, colour, isAccent ? 2.0 : 1.0, {});
	}
	return nodes;
}
