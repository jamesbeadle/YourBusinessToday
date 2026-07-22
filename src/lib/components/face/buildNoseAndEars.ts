import { FacePalette } from './facePalette';
import type { ParticleCollection } from './particleCollection';

const RIDGE_POINT_COUNT = 14;
const RIDGE_TOP = { y: 0.26, z: 0.94 };
const RIDGE_TIP = { y: -0.12, z: 1.13 };
const NOSTRIL_HEIGHT = -0.19;
const NOSTRIL_SPAN = 0.13;
const EAR_POINT_COUNT = 12;
const EAR_CENTRE = { x: 0.92, y: 0.1, z: -0.02 };
const EAR_HEIGHT_RADIUS = 0.19;
const EAR_DEPTH_RADIUS = 0.1;

function buildRidge(collection: ParticleCollection): void {
	for (let step = 0; step < RIDGE_POINT_COUNT; step += 1) {
		const progress = step / (RIDGE_POINT_COUNT - 1);
		collection.add(
			{
				x: 0,
				y: RIDGE_TOP.y + (RIDGE_TIP.y - RIDGE_TOP.y) * progress,
				z: RIDGE_TOP.z + (RIDGE_TIP.z - RIDGE_TOP.z) * Math.pow(progress, 1.4)
			},
			FacePalette.chalk,
			1.2,
			{}
		);
	}
}

function buildNostrils(collection: ParticleCollection): void {
	for (let step = 0; step < 9; step += 1) {
		const progress = step / 8;
		const acrossFace = (progress * 2 - 1) * NOSTRIL_SPAN;
		collection.add(
			{ x: acrossFace, y: NOSTRIL_HEIGHT - Math.cos(progress * Math.PI) * 0.015, z: 1.0 },
			FacePalette.chalk,
			1.1,
			{}
		);
	}
}

function buildEars(collection: ParticleCollection): void {
	for (const side of [-1, 1]) {
		for (let step = 0; step < EAR_POINT_COUNT; step += 1) {
			const angle = (step / EAR_POINT_COUNT) * Math.PI * 2;
			collection.add(
				{
					x: side * (EAR_CENTRE.x + Math.sin(angle) * 0.04),
					y: EAR_CENTRE.y + Math.cos(angle) * EAR_HEIGHT_RADIUS,
					z: EAR_CENTRE.z + Math.sin(angle) * EAR_DEPTH_RADIUS
				},
				FacePalette.shell,
				1.1,
				{}
			);
		}
	}
}

export function buildNoseAndEars(collection: ParticleCollection): void {
	buildRidge(collection);
	buildNostrils(collection);
	buildEars(collection);
}
