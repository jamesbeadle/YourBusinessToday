import {
	AdditiveBlending,
	BufferGeometry,
	Float32BufferAttribute,
	Group,
	LineBasicMaterial,
	LineSegments,
	Points,
	PointsMaterial,
	Vector3,
	type Texture
} from 'three';
import { sampleInsideBrain } from './brainShape';
import { SILVER } from './constellationPalette';

const AMBIENT_NEURON_COUNT = 850;
const NEIGHBOUR_LINK_COUNT = 2;
const LONGEST_LINK = 1.2;
const POINT_SIZE = 0.09;
const FULL_POINT_OPACITY = 0.5;
const FULL_LINE_OPACITY = 0.11;
const DIMMED_SHARE = 0.35;

export type AmbientNeuralWeb = {
	group: Group;
	setFocus: (contextKey: string | null) => void;
	dispose: () => void;
};

export function createAmbientNeuralWeb(glowTexture: Texture): AmbientNeuralWeb {
	const anchors = Array.from({ length: AMBIENT_NEURON_COUNT }, () =>
		sampleInsideBrain(Math.random)
	);
	const pointsGeometry = new BufferGeometry().setFromPoints(anchors);
	const pointsMaterial = new PointsMaterial({
		map: glowTexture,
		color: SILVER,
		size: POINT_SIZE,
		transparent: true,
		opacity: FULL_POINT_OPACITY,
		blending: AdditiveBlending,
		depthWrite: false
	});
	const linesGeometry = new BufferGeometry();
	linesGeometry.setAttribute('position', new Float32BufferAttribute(linkPositions(anchors), 3));
	const linesMaterial = new LineBasicMaterial({
		color: SILVER,
		transparent: true,
		opacity: FULL_LINE_OPACITY,
		blending: AdditiveBlending,
		depthWrite: false
	});
	const group = new Group();
	group.add(new Points(pointsGeometry, pointsMaterial), new LineSegments(linesGeometry, linesMaterial));

	function setFocus(contextKey: string | null): void {
		const share = contextKey === null ? 1 : DIMMED_SHARE;
		pointsMaterial.opacity = FULL_POINT_OPACITY * share;
		linesMaterial.opacity = FULL_LINE_OPACITY * share;
	}

	function dispose(): void {
		pointsGeometry.dispose();
		pointsMaterial.dispose();
		linesGeometry.dispose();
		linesMaterial.dispose();
	}

	return { group, setFocus, dispose };
}

function linkPositions(anchors: Vector3[]): number[] {
	const positions: number[] = [];
	for (let index = 0; index < anchors.length; index += 1) {
		for (const neighbour of nearestNeighbours(anchors, index)) {
			positions.push(...anchors[index].toArray(), ...neighbour.toArray());
		}
	}
	return positions;
}

function nearestNeighbours(anchors: Vector3[], index: number): Vector3[] {
	const distances = anchors
		.map((candidate, candidateIndex) => ({
			candidate,
			candidateIndex,
			distance: candidate.distanceTo(anchors[index])
		}))
		.filter((entry) => entry.candidateIndex > index && entry.distance <= LONGEST_LINK)
		.sort((left, right) => left.distance - right.distance);
	return distances.slice(0, NEIGHBOUR_LINK_COUNT).map((entry) => entry.candidate);
}
