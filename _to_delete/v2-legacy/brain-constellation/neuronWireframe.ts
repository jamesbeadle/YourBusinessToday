import { BufferAttribute, BufferGeometry, type Vector3 } from 'three';
import type { DendriteBranch } from './dendriteBranching';

const ROOT_BRIGHTNESS = 1;
const TIP_BRIGHTNESS = 0.12;

export type Wireframe = { geometry: BufferGeometry; vertexCount: number };

type WireSegment = { start: Vector3; end: Vector3; startBrightness: number; endBrightness: number };

export function wireframeFrom(branches: DendriteBranch[], origin: Vector3): Wireframe {
	const farthestReach = farthestReachOf(branches);
	const segments = branches
		.flatMap((branch) => segmentsOf(branch, farthestReach))
		.sort(byDistanceFromSoma);
	const positions = new Float32Array(segments.length * 6);
	const brightness = new Float32Array(segments.length * 6);
	segments.forEach((segment, index) => {
		writePositions(positions, index, segment, origin);
		writeBrightness(brightness, index, segment);
	});
	const geometry = new BufferGeometry();
	geometry.setAttribute('position', new BufferAttribute(positions, 3));
	geometry.setAttribute('color', new BufferAttribute(brightness, 3));
	return { geometry, vertexCount: segments.length * 2 };
}

export function revealWireframe(wireframe: Wireframe, share: number): void {
	const shownVertexCount = Math.round((wireframe.vertexCount * share) / 2) * 2;
	wireframe.geometry.setDrawRange(0, shownVertexCount);
}

function farthestReachOf(branches: DendriteBranch[]): number {
	let farthest = 0;
	for (const branch of branches) {
		for (const point of branch.points) farthest = Math.max(farthest, point.length());
	}
	return farthest;
}

function segmentsOf(branch: DendriteBranch, farthestReach: number): WireSegment[] {
	const segments: WireSegment[] = [];
	for (let index = 0; index < branch.points.length - 1; index += 1) {
		const start = branch.points[index];
		const end = branch.points[index + 1];
		segments.push({
			start,
			end,
			startBrightness: taperedBrightness(start.length() / farthestReach),
			endBrightness: taperedBrightness(end.length() / farthestReach)
		});
	}
	return segments;
}

function taperedBrightness(reachShare: number): number {
	return ROOT_BRIGHTNESS + (TIP_BRIGHTNESS - ROOT_BRIGHTNESS) * reachShare;
}

function byDistanceFromSoma(left: WireSegment, right: WireSegment): number {
	return left.start.lengthSq() - right.start.lengthSq();
}

function writePositions(
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

function writeBrightness(brightness: Float32Array, index: number, segment: WireSegment): void {
	const { startBrightness: root, endBrightness: tip } = segment;
	brightness.set([root, root, root, tip, tip, tip], index * 6);
}
