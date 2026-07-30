import { FacePalette } from './facePalette';
import type { ParticleCollection } from './particleCollection';

export const eyeCentres = [
	{ x: -0.36, y: 0.28, z: 0.86 },
	{ x: 0.36, y: 0.28, z: 0.86 }
];

const IRIS_RADIUS = 0.085;
const PUPIL_RADIUS = 0.03;
const LID_RADIUS = 0.16;
const LID_FLATTEN = 0.5;

function addRing(
	collection: ParticleCollection,
	centre: { x: number; y: number; z: number },
	radius: number,
	pointCount: number,
	startAngle: number,
	endAngle: number,
	colour: number,
	size: number,
	eyeIndex: number,
	forwardOffset: number,
	verticalScale: number
): void {
	for (let step = 0; step < pointCount; step += 1) {
		const angle = startAngle + ((endAngle - startAngle) * step) / Math.max(1, pointCount - 1);
		collection.add(
			{
				x: centre.x + Math.cos(angle) * radius,
				y: centre.y + Math.sin(angle) * radius * verticalScale,
				z: centre.z + forwardOffset
			},
			colour,
			size,
			{ eyeIndex }
		);
	}
}

export function buildEyes(collection: ParticleCollection): void {
	const fullCircle = Math.PI * 2;
	eyeCentres.forEach((centre, side) => {
		const irisIndex = side + 1;
		const lidIndex = side + 3;
		addRing(
			collection, centre, IRIS_RADIUS, 28, 0, fullCircle,
			FacePalette.nodeGlow, 1.6, irisIndex, 0.04, 0.85
		);
		addRing(
			collection, centre, PUPIL_RADIUS, 10, 0, fullCircle,
			FacePalette.chalk, 1.9, irisIndex, 0.07, 0.85
		);
		addRing(
			collection, centre, LID_RADIUS, 18, Math.PI * 0.12, Math.PI * 0.88,
			FacePalette.wire, 1.15, lidIndex, 0.02, LID_FLATTEN
		);
	});
}
