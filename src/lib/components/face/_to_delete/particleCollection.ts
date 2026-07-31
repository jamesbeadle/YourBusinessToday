import { Color } from 'three';

export type ParticleWeights = {
	jaw?: number;
	lipUpper?: number;
	lipLower?: number;
	corner?: number;
	brow?: number;
	browInner?: number;
	eyeIndex?: number;
};

export type ParticlePoint = { x: number; y: number; z: number };

export class ParticleCollection {
	positions: number[] = [];
	colours: number[] = [];
	sizes: number[] = [];
	jaw: number[] = [];
	lipUpper: number[] = [];
	lipLower: number[] = [];
	corner: number[] = [];
	brow: number[] = [];
	browInner: number[] = [];
	eyeIndex: number[] = [];

	add(point: ParticlePoint, colourHex: number, size: number, weights: ParticleWeights = {}): void {
		this.positions.push(point.x, point.y, point.z);
		const colour = new Color(colourHex);
		this.colours.push(colour.r, colour.g, colour.b);
		this.sizes.push(size);
		this.jaw.push(weights.jaw ?? 0);
		this.lipUpper.push(weights.lipUpper ?? 0);
		this.lipLower.push(weights.lipLower ?? 0);
		this.corner.push(weights.corner ?? 0);
		this.brow.push(weights.brow ?? 0);
		this.browInner.push(weights.browInner ?? 0);
		this.eyeIndex.push(weights.eyeIndex ?? 0);
	}

	get count(): number {
		return this.sizes.length;
	}
}
