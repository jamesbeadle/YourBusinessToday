import type { PerspectiveCamera } from 'three';
import {
	DIVE_SECONDS, FACE_CAMERA_DISTANCE, RETURN_SECONDS,
	diveCameraDistance, diveFade, diveParticleOpacity, diveSpread
} from './diveChoreography';
import type { FaceWorld } from './faceWorld';

export type TransitionContext = {
	camera: PerspectiveCamera;
	faceWorld: FaceWorld;
	onFade: (opacity: number) => void;
};

export function advanceDiveIn(
	context: TransitionContext,
	previousProgress: number,
	deltaSeconds: number
): { progress: number; isFinished: boolean } {
	const progress = Math.min(1, previousProgress + deltaSeconds / DIVE_SECONDS);
	context.camera.position.set(0, 0, diveCameraDistance(progress));
	context.faceWorld.setSpread(diveSpread(progress));
	context.faceWorld.setOpacity(diveParticleOpacity(progress));
	context.onFade(diveFade(progress));
	if (progress < 1) return { progress, isFinished: false };
	context.faceWorld.setSpread(1);
	context.faceWorld.setOpacity(1);
	return { progress, isFinished: true };
}

export function advanceDiveOut(
	context: TransitionContext,
	previousProgress: number,
	deltaSeconds: number
): { progress: number; isFinished: boolean } {
	const progress = previousProgress + deltaSeconds / RETURN_SECONDS;
	context.onFade(Math.min(1, progress));
	if (progress < 1) return { progress, isFinished: false };
	context.camera.position.set(0, 0, FACE_CAMERA_DISTANCE);
	context.camera.lookAt(0, 0, 0);
	return { progress, isFinished: true };
}
