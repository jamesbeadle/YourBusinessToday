export type Vector4 = [number, number, number, number];

const PROJECTION_DISTANCE = 3;

export function tesseractVertices(): Vector4[] {
	const vertices: Vector4[] = [];
	for (let corner = 0; corner < 16; corner += 1) {
		vertices.push([
			corner & 1 ? 1 : -1,
			corner & 2 ? 1 : -1,
			corner & 4 ? 1 : -1,
			corner & 8 ? 1 : -1
		]);
	}
	return vertices;
}

export function tesseractEdges(): [number, number][] {
	const edges: [number, number][] = [];
	for (let from = 0; from < 16; from += 1) {
		for (const bit of [1, 2, 4, 8]) {
			const to = from ^ bit;
			if (to > from) edges.push([from, to]);
		}
	}
	return edges;
}

export function rotateInPlane(
	vertex: Vector4,
	angle: number,
	axisA: number,
	axisB: number
): Vector4 {
	const rotated: Vector4 = [...vertex];
	const cosine = Math.cos(angle);
	const sine = Math.sin(angle);
	rotated[axisA] = vertex[axisA] * cosine - vertex[axisB] * sine;
	rotated[axisB] = vertex[axisA] * sine + vertex[axisB] * cosine;
	return rotated;
}

export function projectTo3d(vertex: Vector4, scale: number): { x: number; y: number; z: number } {
	const perspective = PROJECTION_DISTANCE / (PROJECTION_DISTANCE - vertex[3]);
	return {
		x: vertex[0] * perspective * scale,
		y: vertex[1] * perspective * scale,
		z: vertex[2] * perspective * scale
	};
}
