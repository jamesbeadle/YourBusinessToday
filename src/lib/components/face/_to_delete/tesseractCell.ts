import {
	AdditiveBlending, BufferAttribute, BufferGeometry, LineBasicMaterial, LineSegments
} from 'three';
import { projectTo3d, rotateInPlane, tesseractEdges, tesseractVertices } from './tesseractGeometry';

const XW_SPIN_RATE = 0.38;
const YW_SPIN_RATE = 0.23;
const ZW_SPIN_RATE = 0.31;

export class TesseractCell {
	readonly lines: LineSegments;
	private vertices = tesseractVertices();
	private edges = tesseractEdges();
	private positions: Float32Array;
	private scale: number;

	constructor(scale: number, colourHex: number, opacity: number) {
		this.scale = scale;
		this.positions = new Float32Array(this.edges.length * 2 * 3);
		const geometry = new BufferGeometry();
		geometry.setAttribute('position', new BufferAttribute(this.positions, 3));
		const material = new LineBasicMaterial({
			color: colourHex,
			transparent: true,
			opacity,
			depthWrite: false,
			blending: AdditiveBlending
		});
		this.lines = new LineSegments(geometry, material);
		this.lines.frustumCulled = false;
	}

	update(timeSeconds: number, phase: number): void {
		const projected = this.vertices.map((vertex) => {
			let spun = rotateInPlane(vertex, timeSeconds * XW_SPIN_RATE + phase, 0, 3);
			spun = rotateInPlane(spun, timeSeconds * YW_SPIN_RATE + phase * 0.7, 1, 3);
			spun = rotateInPlane(spun, timeSeconds * ZW_SPIN_RATE + phase * 1.3, 2, 3);
			return projectTo3d(spun, this.scale);
		});
		this.edges.forEach(([from, to], edgeIndex) => {
			const at = edgeIndex * 6;
			this.positions.set(
				[
					projected[from].x, projected[from].y, projected[from].z,
					projected[to].x, projected[to].y, projected[to].z
				],
				at
			);
		});
		const attribute = this.lines.geometry.getAttribute('position') as BufferAttribute;
		attribute.needsUpdate = true;
	}
}
