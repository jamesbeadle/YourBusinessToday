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

export type ClearZone = { centre: Vector3; radius: number };

export type AmbientNeuralWeb = {
	group: Group;
	keepClearOf: (zones: ClearZone[]) => void;
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
	const links = linksAmong(anchors);
	const linesGeometry = new BufferGeometry();
	layLinks([]);
	const linesMaterial = new LineBasicMaterial({
		color: SILVER,
		transparent: true,
		opacity: FULL_LINE_OPACITY,
		blending: AdditiveBlending,
		depthWrite: false
	});
	const group = new Group();
	group.add(new Points(pointsGeometry, pointsMaterial), new LineSegments(linesGeometry, linesMaterial));

	function layLinks(zones: ClearZone[]): void {
		const clearLinks = links.filter((link) => zones.every((zone) => !crosses(link, zone)));
		linesGeometry.setAttribute('position', new Float32BufferAttribute(linkPositions(clearLinks), 3));
	}

	function keepClearOf(zones: ClearZone[]): void {
		layLinks(zones);
	}

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

	return { group, keepClearOf, setFocus, dispose };
}

type Link = { start: Vector3; end: Vector3 };

function linksAmong(anchors: Vector3[]): Link[] {
	const links: Link[] = [];
	for (let index = 0; index < anchors.length; index += 1) {
		for (const neighbour of nearestNeighbours(anchors, index)) {
			links.push({ start: anchors[index], end: neighbour });
		}
	}
	return links;
}

function linkPositions(links: Link[]): number[] {
	return links.flatMap((link) => [...link.start.toArray(), ...link.end.toArray()]);
}

function crosses(link: Link, zone: ClearZone): boolean {
	const along = link.end.clone().sub(link.start);
	const toCentre = zone.centre.clone().sub(link.start);
	const share = Math.min(1, Math.max(0, toCentre.dot(along) / along.lengthSq()));
	const nearest = link.start.clone().addScaledVector(along, share);
	return nearest.distanceTo(zone.centre) < zone.radius;
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
