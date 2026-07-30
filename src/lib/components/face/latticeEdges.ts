import {
	AdditiveBlending, BufferAttribute, BufferGeometry, LineBasicMaterial, LineSegments
} from 'three';
import type { ParticlePoint } from './particleCollection';

export function nearestNeighbourEdges(
	points: ParticlePoint[],
	neighbourCount: number
): [number, number][] {
	const seen = new Set<string>();
	const edges: [number, number][] = [];
	points.forEach((point, index) => {
		const neighbours = points
			.map((other, otherIndex) => ({
				otherIndex,
				distance: Math.hypot(other.x - point.x, other.y - point.y, other.z - point.z)
			}))
			.filter((entry) => entry.otherIndex !== index)
			.sort((first, second) => first.distance - second.distance)
			.slice(0, neighbourCount);
		for (const neighbour of neighbours) {
			const low = Math.min(index, neighbour.otherIndex);
			const high = Math.max(index, neighbour.otherIndex);
			const key = `${low}:${high}`;
			if (seen.has(key)) continue;
			seen.add(key);
			edges.push([low, high]);
		}
	});
	return edges;
}

export function createLatticeLines(
	points: ParticlePoint[],
	edges: [number, number][],
	colourHex: number,
	opacity: number
): LineSegments {
	const positions = new Float32Array(edges.length * 6);
	edges.forEach(([from, to], edgeIndex) => {
		positions.set(
			[points[from].x, points[from].y, points[from].z, points[to].x, points[to].y, points[to].z],
			edgeIndex * 6
		);
	});
	const geometry = new BufferGeometry();
	geometry.setAttribute('position', new BufferAttribute(positions, 3));
	const material = new LineBasicMaterial({
		color: colourHex,
		transparent: true,
		opacity,
		depthWrite: false,
		blending: AdditiveBlending
	});
	const lines = new LineSegments(geometry, material);
	lines.frustumCulled = false;
	lines.userData.baseOpacity = opacity;
	return lines;
}
