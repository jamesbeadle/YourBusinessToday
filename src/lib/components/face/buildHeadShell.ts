import { FacePalette } from './facePalette';
import type { ParticleCollection, ParticlePoint } from './particleCollection';

const SHELL_POINT_COUNT = 4600;
const SKULL_WIDTH = 0.95;
const SKULL_HEIGHT = 1.25;
const SKULL_DEPTH = 1.05;
const JAW_START_HEIGHT = -0.35;
const JAW_TAPER = 0.45;
const BACK_FLATTEN = 0.85;
const FEATURE_CLEARANCE = 0.15;

const eyeSockets = [
	{ x: -0.36, y: 0.28 },
	{ x: 0.36, y: 0.28 }
];
const mouthOpening = { x: 0, y: -0.55 };

function randomDirection(): ParticlePoint {
	const azimuth = Math.random() * Math.PI * 2;
	const elevation = Math.acos(Math.random() * 2 - 1);
	return {
		x: Math.sin(elevation) * Math.cos(azimuth),
		y: Math.cos(elevation),
		z: Math.sin(elevation) * Math.sin(azimuth)
	};
}

function sculptSkull(direction: ParticlePoint): ParticlePoint {
	const point = {
		x: direction.x * SKULL_WIDTH,
		y: direction.y * SKULL_HEIGHT,
		z: direction.z * SKULL_DEPTH
	};
	const jawDrop = Math.max(0, (JAW_START_HEIGHT - point.y) / (SKULL_HEIGHT + JAW_START_HEIGHT));
	point.x *= 1 - JAW_TAPER * jawDrop;
	point.z *= 1 - JAW_TAPER * 0.55 * jawDrop;
	if (point.z < 0) point.z *= BACK_FLATTEN;
	return point;
}

function isInsideFeatureOpening(point: ParticlePoint): boolean {
	if (point.z < 0.55) return false;
	for (const socket of eyeSockets) {
		if (Math.hypot(point.x - socket.x, point.y - socket.y) < FEATURE_CLEARANCE) return true;
	}
	return Math.hypot(point.x - mouthOpening.x, point.y - mouthOpening.y) < FEATURE_CLEARANCE * 1.4;
}

function jawWeightFor(point: ParticlePoint): number {
	if (point.y > -0.45 || point.z < 0.2) return 0;
	return Math.min(1, (-0.45 - point.y) / 0.6) * 0.8;
}

export function buildHeadShell(collection: ParticleCollection): void {
	let added = 0;
	while (added < SHELL_POINT_COUNT) {
		const point = sculptSkull(randomDirection());
		if (isInsideFeatureOpening(point)) continue;
		const size = 0.6 + Math.random() * 0.55;
		collection.add(point, FacePalette.shell, size, { jaw: jawWeightFor(point) });
		added += 1;
	}
}
