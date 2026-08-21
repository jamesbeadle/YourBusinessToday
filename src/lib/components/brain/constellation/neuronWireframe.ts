import { BufferAttribute, BufferGeometry, type Vector3 } from 'three';
import type { DendriteBranch } from './dendriteBranching';

export type Wireframe = { geometry: BufferGeometry; vertexCount: number };

type WireSegment = { start: Vector3; end: Vector3 };

export function wireframeFrom(branches: DendriteBranch[], origin: Vector3): Wireframe {
	const segments = branches.flatMap(segmentsOf).sort(byDistanceFromSoma);
	const positions = new Float32Array(segments.length * 6);
	segments.forEach((segment, index) => writeSegment(positions, index, segment, origin));
	const geometry = new BufferGeometry();
	geometry.setAttribute('position', new BufferAttribute(positions, 3));
	return { geometry, vertexCount: segments.length * 2 };
}

export function revealWireframe(wireframe: Wireframe, share: number): void {
	const shownVertexCount = Math.round((wireframe.vertexCount * share) / 2) * 2;
	wireframe.geometry.setDrawRange(0, shownVertexCount);
}

function segmentsOf(branch: DendriteBranch): WireSegment[] {
	const segments: WireSegment[] = [];
	for (let index = 0; index < branch.points.length - 1; index += 1) {
		segments.push({ start: branch.points[index], end: branch.points[index + 1] });
	}
	return segments;
}

function byDistanceFromSoma(left: WireSegment, right: WireSegment): number {
	return left.start.lengthSq() - right.start.lengthSq();
}

function writeSegment(
	positions: Float32Array,
	index: number,
	segment: WireSegment,
	origin: Vector3
): void {
	positions.set(
		[
			segment.start.x + origin.x,
			segment.start.y + origin.y,
			segment.start.z + origin.z,
			segment.end.x + origin.x,
			segment.end.y + origin.y,
			segment.end.z + origin.z
		],
		index * 6
	);
}
