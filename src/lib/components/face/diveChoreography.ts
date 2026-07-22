export const FACE_CAMERA_DISTANCE = 5.0;
export const DIVE_SECONDS = 2.1;
export const EMERGE_SECONDS = 0.9;
export const RETURN_SECONDS = 0.7;

const DIVE_END_DISTANCE = 0.55;
const DIVE_SPREAD = 3.2;
const FADE_BEGINS_AT = 0.55;

function easeIn(progress: number): number {
	return progress * progress * progress;
}

export function diveCameraDistance(progress: number): number {
	return FACE_CAMERA_DISTANCE + (DIVE_END_DISTANCE - FACE_CAMERA_DISTANCE) * easeIn(progress);
}

export function diveSpread(progress: number): number {
	return 1 + (DIVE_SPREAD - 1) * easeIn(progress);
}

export function diveParticleOpacity(progress: number): number {
	return 1 - easeIn(progress) * 0.85;
}

export function diveFade(progress: number): number {
	if (progress < FADE_BEGINS_AT) return 0;
	return Math.min(1, (progress - FADE_BEGINS_AT) / (1 - FADE_BEGINS_AT));
}
