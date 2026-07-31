import type { FaceRigParameters } from './faceRigParameters';
import type { RigWeights } from './rigWeights';

export type CubeOffset = { across: number; up: number; depth: number };

const BROW_RAISE_LIFT = 0.045;
const BROW_FURROW_PULL = 0.05;
const BROW_FURROW_DROP = 0.028;
const JAW_SHELL_DROP = 0.2;
const LIP_LOWER_DROP = 0.22;
const MOUTH_WIDEN = 0.3;
const LIP_ROUND_PULL = 0.45;
const LIP_ROUND_FORWARD = 0.06;
const MOUTH_HOLLOW = 0.16;
const CAVITY_ANCHORING = 0.55;
const CAVITY_STRETCH = 5.5;
const SMILE_CORNER_LIFT = 0.09;
const SMILE_CORNER_SPREAD = 0.05;

function browOffset(across: number, weights: RigWeights, parameters: FaceRigParameters): CubeOffset {
	const furrow = Math.max(0, -parameters.browRaise);
	const inner = weights.browInner;
	return {
		across: -furrow * BROW_FURROW_PULL * inner * Math.sign(across),
		up: parameters.browRaise * BROW_RAISE_LIFT * weights.brow - furrow * BROW_FURROW_DROP * inner,
		depth: 0
	};
}

function mouthOffset(across: number, weights: RigWeights, parameters: FaceRigParameters): CubeOffset {
	const lip = weights.lip;
	const lower = 1 - weights.lipUpper;
	return {
		across:
			across * lip * (parameters.mouthWidth * MOUTH_WIDEN - parameters.lipRound * LIP_ROUND_PULL) +
			parameters.mouthCurve * SMILE_CORNER_SPREAD * weights.corner,
		up:
			parameters.mouthCurve * SMILE_CORNER_LIFT * Math.abs(weights.corner) -
			parameters.jawOpen * LIP_LOWER_DROP * lip * lower,
		depth: lip * (parameters.lipRound * LIP_ROUND_FORWARD - parameters.jawOpen * MOUTH_HOLLOW)
	};
}

export function verticalStretchFor(weights: RigWeights, parameters: FaceRigParameters): number {
	return 1 + parameters.jawOpen * CAVITY_STRETCH * weights.cavity;
}

export function displacementFor(
	across: number,
	weights: RigWeights,
	parameters: FaceRigParameters
): CubeOffset {
	const brow = browOffset(across, weights, parameters);
	const mouth = mouthOffset(across, weights, parameters);
	const anchoring = 1 - weights.cavity * CAVITY_ANCHORING;
	return {
		across: brow.across + mouth.across,
		up: brow.up + mouth.up - parameters.jawOpen * JAW_SHELL_DROP * weights.jaw * anchoring,
		depth: brow.depth + mouth.depth
	};
}
