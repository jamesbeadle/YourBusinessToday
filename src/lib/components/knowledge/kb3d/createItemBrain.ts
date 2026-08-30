import { Color, Scene } from 'three';
import { buildItemBrainCloud } from './itemBrainCloud';
import { createGlowTexture } from '../../brain/constellation/glowTexture';
import { createOrbitRig, prefersReducedMotion } from '../../brain/constellation/orbitRig';
import { createStage, fitStageTo } from '../../stage/createStage';
import { createStarBackdrop } from '../../brain/constellation/starBackdrop';
import { NIGHT_SKY } from '../../brain/constellation/constellationPalette';
import { startAnimationLoop } from '../../stage/animationLoop';

const CAMERA_START = { x: 0, y: 1.1, z: 9.5 } as const;
const SPIN_SPEED = 0.05;

export type ItemBrainOptions = { seed: string; accent: string; itemCount: number };

export type ItemBrainExperience = { destroy: () => void };

export function createItemBrain(
	canvas: HTMLCanvasElement,
	container: HTMLElement,
	options: ItemBrainOptions
): ItemBrainExperience {
	const stage = createStage(canvas, { fieldOfViewDegrees: 46, farPlane: 160 });
	stage.camera.position.set(CAMERA_START.x, CAMERA_START.y, CAMERA_START.z);
	const scene = new Scene();
	scene.background = new Color(NIGHT_SKY);
	const glowTexture = createGlowTexture();
	const backdrop = createStarBackdrop();
	scene.add(backdrop.points);
	const cloud = buildItemBrainCloud(options.seed, options.accent, options.itemCount, glowTexture);
	scene.add(cloud.group);
	const controls = createOrbitRig(stage.camera, canvas);
	const isAnimated = !prefersReducedMotion();
	const resizeObserver = fitStageTo(stage, container);

	const stopLoop = startAnimationLoop((deltaSeconds) => {
		controls.update();
		if (isAnimated) cloud.group.rotation.y += deltaSeconds * SPIN_SPEED;
		stage.renderer.render(scene, stage.camera);
	});

	return {
		destroy: () => {
			stopLoop();
			resizeObserver.disconnect();
			controls.dispose();
			cloud.dispose();
			backdrop.dispose();
			glowTexture.dispose();
			stage.dispose();
		}
	};
}
