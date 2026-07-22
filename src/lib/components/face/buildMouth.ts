import { FacePalette } from './facePalette';
import type { ParticleCollection } from './particleCollection';

export const mouthCentre = { x: 0, y: -0.55, z: 0.92 };

const OUTER_LIP_POINTS = 44;
const OUTER_HALF_WIDTH = 0.3;
const OUTER_HALF_HEIGHT = 0.085;
const INNER_LIP_POINTS = 28;
const INNER_HALF_WIDTH = 0.2;
const INNER_HALF_HEIGHT = 0.045;
const CORNER_START = 0.55;

function cornerAmount(acrossMouth: number): number {
	const magnitude = Math.abs(acrossMouth);
	if (magnitude < CORNER_START) return 0;
	return Math.sign(acrossMouth) * ((magnitude - CORNER_START) / (1 - CORNER_START));
}

function buildLipLoop(
	collection: ParticleCollection,
	pointCount: number,
	halfWidth: number,
	halfHeight: number,
	size: number
): void {
	for (let step = 0; step < pointCount; step += 1) {
		const angle = (step / pointCount) * Math.PI * 2;
		const acrossMouth = Math.cos(angle);
		const isUpper = Math.sin(angle) >= 0;
		collection.add(
			{
				x: mouthCentre.x + acrossMouth * halfWidth,
				y: mouthCentre.y + Math.sin(angle) * halfHeight,
				z: mouthCentre.z + (1 - Math.abs(acrossMouth)) * 0.03
			},
			FacePalette.signal,
			size,
			{
				lipUpper: isUpper ? 1 : 0,
				lipLower: isUpper ? 0 : 1,
				corner: cornerAmount(acrossMouth)
			}
		);
	}
}

export function buildMouth(collection: ParticleCollection): void {
	buildLipLoop(collection, OUTER_LIP_POINTS, OUTER_HALF_WIDTH, OUTER_HALF_HEIGHT, 1.7);
	buildLipLoop(collection, INNER_LIP_POINTS, INNER_HALF_WIDTH, INNER_HALF_HEIGHT, 1.3);
}
