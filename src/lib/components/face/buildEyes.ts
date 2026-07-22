import { FacePalette } from './facePalette';
import type { ParticleCollection } from './particleCollection';

export const eyeCentres = [
	{ x: -0.36, y: 0.28, z: 0.86 },
	{ x: 0.36, y: 0.28, z: 0.86 }
];

const IRIS_RADIUS = 0.085;
const PUPIL_RADIUS = 0.03;
const UPPER_LID_RADIUS = 0.145;
const LOWER_LID_RADIUS = 0.125;

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
	forwardOffset: number
): void {
	for (let step = 0; step < pointCount; step += 1) {
		const angle = startAngle + ((endAngle - startAngle) * step) / Math.max(1, pointCount - 1);
		collection.add(
			{
				x: centre.x + Math.cos(angle) * radius,
				y: centre.y + Math.sin(angle) * radius * 0.85,
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
		addRing(collection, centre, IRIS_RADIUS, 30, 0, fullCircle, FacePalette.go, 1.7, irisIndex, 0.04);
		addRing(collection, centre, PUPIL_RADIUS, 10, 0, fullCircle, FacePalette.chalk, 1.9, irisIndex, 0.07);
		addRing(
			collection, centre, UPPER_LID_RADIUS, 20,
			Math.PI * 0.12, Math.PI * 0.88, FacePalette.chalk, 1.25, lidIndex, 0.02
		);
		addRing(
			collection, centre, LOWER_LID_RADIUS, 14,
			Math.PI * 1.15, Math.PI * 1.85, FacePalette.chalk, 1.05, lidIndex, 0.01
		);
	});
}
