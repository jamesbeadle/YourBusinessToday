import { MathUtils } from 'three';
import { assembleKbGalaxy } from './kbGalaxyAssembly';
import { attachKbGalaxyInput } from './kbGalaxyInput';
import { createOrbitRig, prefersReducedMotion } from '../../brain/constellation/orbitRig';
import { createStage, fitStageTo } from '../../stage/createStage';
import { startAnimationLoop } from '../../stage/animationLoop';
import type { ConstellationSlot } from '../constellationSlots';

const FIELD_OF_VIEW_DEGREES = 46;
const FAR_PLANE = 160;
const CAMERA_START = { x: 0, y: 6, z: 19 } as const;
const BOB_HEIGHT = 0.3;
const HOVER_SCALE = 1.14;
const SCALE_EASE = 6;

export type KbGalaxyExperience = { destroy: () => void };

export function createKbGalaxy(
	canvas: HTMLCanvasElement,
	container: HTMLElement,
	slots: ConstellationSlot[],
	onActivate: (slot: ConstellationSlot) => void
): KbGalaxyExperience {
	const isAnimated = !prefersReducedMotion();
	const stage = createStage(canvas, {
		fieldOfViewDegrees: FIELD_OF_VIEW_DEGREES,
		farPlane: FAR_PLANE
	});
	stage.camera.position.set(CAMERA_START.x, CAMERA_START.y, CAMERA_START.z);
	const galaxy = assembleKbGalaxy(slots);
	const controls = createOrbitRig(stage.camera, canvas);
	let hoveredSlotId: string | null = null;

	const input = attachKbGalaxyInput({
		canvas,
		camera: stage.camera,
		handles: galaxy.handles,
		onHover: (slot) => (hoveredSlotId = slot?.id ?? null),
		onActivate
	});
	const resizeObserver = fitStageTo(stage, container);

	function frame(deltaSeconds: number, timeSeconds: number): void {
		controls.update();
		for (const handle of galaxy.handles) {
			if (isAnimated) {
				handle.group.rotation.y += deltaSeconds * handle.spinSpeed;
				handle.group.position.y =
					handle.baseY + Math.sin(timeSeconds * 0.6 + handle.bobPhase) * BOB_HEIGHT;
			}
			const targetScale = handle.slot.id === hoveredSlotId ? HOVER_SCALE : 1;
			const eased = MathUtils.lerp(
				handle.group.scale.x,
				targetScale,
				Math.min(1, deltaSeconds * SCALE_EASE)
			);
			handle.group.scale.setScalar(eased);
		}
		stage.renderer.render(galaxy.scene, stage.camera);
	}

	const stopLoop = startAnimationLoop(frame);

	return {
		destroy: () => {
			stopLoop();
			input.detach();
			resizeObserver.disconnect();
			controls.dispose();
			galaxy.dispose();
			stage.dispose();
		}
	};
}
