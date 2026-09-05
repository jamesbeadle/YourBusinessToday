import { Vector3 } from 'three';
import { createGalaxyFocus } from './kbGalaxyFocus';
import { createKbGalaxyScene } from './kbGalaxyScene';
import { animateSlotHandles } from './slotHandleMotion';
import { createOrbitRig, prefersReducedMotion } from '../../brain/constellation/orbitRig';
import { createStage, fitStageTo } from '../../stage/createStage';
import { startAnimationLoop } from '../../stage/animationLoop';
import type { ConstellationSlot } from '../constellationSlots';

const FIELD_OF_VIEW_DEGREES = 46;
const FAR_PLANE = 160;
const CAMERA_START = new Vector3(0, 6, 19);

export type FocusOptions = { isInstant?: boolean };

export type KbGalaxyExperience = {
	focusSlot: (slotId: string, options?: FocusOptions) => void;
	releaseFocus: () => void;
	pause: () => void;
	resume: () => void;
	updateSlots: (slots: ConstellationSlot[]) => void;
	destroy: () => void;
};

export function createKbGalaxy(
	canvas: HTMLCanvasElement,
	container: HTMLElement,
	initialSlots: ConstellationSlot[],
	onActivate: (slot: ConstellationSlot) => void
): KbGalaxyExperience {
	const isAnimated = !prefersReducedMotion();
	const stage = createStage(canvas, {
		fieldOfViewDegrees: FIELD_OF_VIEW_DEGREES,
		farPlane: FAR_PLANE
	});
	stage.camera.position.copy(CAMERA_START);
	const controls = createOrbitRig(stage.camera, canvas);
	const focus = createGalaxyFocus(stage.camera, controls, CAMERA_START, isAnimated);
	const resizeObserver = fitStageTo(stage, container);
	let hoveredSlotId: string | null = null;
	const scene = createKbGalaxyScene({
		canvas,
		camera: stage.camera,
		initialSlots,
		onHover: (slot) => (hoveredSlotId = slot?.id ?? null),
		onActivate
	});
	let stopLoop: (() => void) | null = startAnimationLoop(frame);

	function frame(deltaSeconds: number, timeSeconds: number): void {
		const galaxy = scene.galaxy();
		focus.update(deltaSeconds);
		controls.update();
		animateSlotHandles(galaxy.handles, deltaSeconds, timeSeconds, {
			isAnimated,
			hoveredSlotId,
			focusedSlotId: focus.focusedSlotId()
		});
		stage.renderer.render(galaxy.scene, stage.camera);
	}

	function focusSlot(slotId: string, options: FocusOptions = {}): void {
		const handle = scene.galaxy().handles.find((candidate) => candidate.slot.id === slotId);
		if (handle === undefined) return;
		focus.focus(handle, options.isInstant ?? false);
	}

	function pause(): void {
		stopLoop?.();
		stopLoop = null;
	}

	function resume(): void {
		if (stopLoop !== null) return;
		stopLoop = startAnimationLoop(frame);
	}

	function updateSlots(slots: ConstellationSlot[]): void {
		const focusedSlotId = focus.focusedSlotId();
		scene.replace(slots);
		focus.release(true);
		if (focusedSlotId !== null) focusSlot(focusedSlotId, { isInstant: true });
		frame(0, 0);
	}

	function destroy(): void {
		pause();
		scene.dispose();
		resizeObserver.disconnect();
		controls.dispose();
		stage.dispose();
	}

	return { focusSlot, releaseFocus: () => focus.release(false), pause, resume, updateSlots, destroy };
}
