import type { BufferAttribute, BufferGeometry } from 'three';
import { eyeCentres } from './buildEyes';
import type { FaceRigParameters } from './faceRigParameters';
import type { ParticleCollection } from './particleCollection';

export type GazeOffset = { x: number; y: number };

const BROW_RAISE_LIFT = 0.11;
const BROW_FURROW_PULL = 0.06;
const BROW_FURROW_DROP = 0.05;
const BLINK_MINIMUM = 0.1;
const GAZE_REACH = 0.06;
const MOUTH_WIDEN = 0.35;
const LIP_ROUND_PULL = 0.55;
const LIP_ROUND_FORWARD = 0.1;
const LIP_ROUND_PART = 0.028;
const JAW_LOWER_LIP_DROP = 0.27;
const JAW_SHELL_DROP = 0.16;
const SMILE_CORNER_LIFT = 0.1;
const SMILE_CORNER_SPREAD = 0.05;

export class FaceRig {
	private basePositions: Float32Array;
	private collection: ParticleCollection;
	private positionAttribute: BufferAttribute;

	constructor(geometry: BufferGeometry, collection: ParticleCollection) {
		this.positionAttribute = geometry.getAttribute('position') as BufferAttribute;
		this.basePositions = new Float32Array(this.positionAttribute.array);
		this.collection = collection;
	}

	applyParameters(parameters: FaceRigParameters, gaze: GazeOffset): void {
		const output = this.positionAttribute.array as Float32Array;
		const furrow = Math.max(0, -parameters.browRaise);
		const eyeSquish = BLINK_MINIMUM + (1 - BLINK_MINIMUM) * parameters.eyeOpenness;
		for (let index = 0; index < this.collection.count; index += 1) {
			const at = index * 3;
			let x = this.basePositions[at];
			let y = this.basePositions[at + 1];
			let z = this.basePositions[at + 2];

			const brow = this.collection.brow[index];
			if (brow > 0) {
				y += parameters.browRaise * BROW_RAISE_LIFT * brow;
				const inner = this.collection.browInner[index];
				x -= furrow * BROW_FURROW_PULL * inner * Math.sign(x);
				y -= furrow * BROW_FURROW_DROP * inner;
			}

			const eyeIndex = this.collection.eyeIndex[index];
			if (eyeIndex > 0) {
				const centre = eyeCentres[(eyeIndex - 1) % 2];
				y = centre.y + (y - centre.y) * eyeSquish;
				if (eyeIndex <= 2) {
					x += gaze.x * GAZE_REACH;
					y += gaze.y * GAZE_REACH * 0.7;
				}
			}

			const lipUpper = this.collection.lipUpper[index];
			const lipLower = this.collection.lipLower[index];
			const lipMask = Math.max(lipUpper, lipLower);
			if (lipMask > 0) {
				x += x * parameters.mouthWidth * MOUTH_WIDEN;
				x -= x * parameters.lipRound * LIP_ROUND_PULL;
				z += parameters.lipRound * LIP_ROUND_FORWARD;
				y += parameters.lipRound * LIP_ROUND_PART * (lipUpper - lipLower);
				y -= parameters.jawOpen * JAW_LOWER_LIP_DROP * lipLower;
				const corner = this.collection.corner[index];
				y += parameters.mouthCurve * SMILE_CORNER_LIFT * Math.abs(corner);
				x += parameters.mouthCurve * SMILE_CORNER_SPREAD * corner;
			}

			y -= parameters.jawOpen * JAW_SHELL_DROP * this.collection.jaw[index];

			output[at] = x;
			output[at + 1] = y;
			output[at + 2] = z;
		}
		this.positionAttribute.needsUpdate = true;
	}
}
