import { FacePalette } from './facePalette';
import type { ParticleCollection } from './particleCollection';

const BROW_POINT_COUNT = 18;
const BROW_INNER_X = 0.13;
const BROW_OUTER_X = 0.6;
const BROW_BASE_HEIGHT = 0.47;
const BROW_ARCH = 0.05;
const BROW_INNER_DEPTH = 0.92;
const BROW_DEPTH_FALL = 0.22;
const BROW_ROW_GAP = 0.035;

export function buildBrows(collection: ParticleCollection): void {
	for (const side of [-1, 1]) {
		for (const rowLift of [0, BROW_ROW_GAP]) {
			for (let step = 0; step < BROW_POINT_COUNT; step += 1) {
				const progress = step / (BROW_POINT_COUNT - 1);
				collection.add(
					{
						x: side * (BROW_INNER_X + (BROW_OUTER_X - BROW_INNER_X) * progress),
						y: BROW_BASE_HEIGHT + rowLift + BROW_ARCH * Math.sin(Math.PI * progress),
						z: BROW_INNER_DEPTH - BROW_DEPTH_FALL * progress
					},
					FacePalette.chalk,
					1.3,
					{ brow: 1, browInner: 1 - progress }
				);
			}
		}
	}
}
