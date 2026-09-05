import { Vector3 } from 'three';
import { createGalaxyFocus, type FocusOptions } from './kbGalaxyFocus';
import { createKbGalaxyScene } from './kbGalaxyScene';
import { animateSlotHandles, settleSlotHandles, type SlotMotionState } from './slotHandleMotion';
import { createOrbitRig, prefersReducedMotion } from '../../brain/constellation/orbitRig';
import { createStage, fitStageTo } from '../../stage/createStage';
import { startAnimationLoop } from '../../stage/animationLoop';
import type { ConstellationSlot } from '../constellationSlots';

const STAGE_OPTIONS = { fieldOfViewDegrees: 46, farPlane: 160 };
const CAMERA_START = new Vector3(0, 6, 19);

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
	const stage = createStage(canvas, STAGE_OPTIONS);
	stage.camera.position.copy(CAMERA_START);
	const controls = createOrbitRig(stage.camera, canvas);
	const focus = createGalaxyFocus(stage.camera, controls, CAMERA_START, isAnimated);
	let hoveredSlotId: string | null = null;
	const scene = createKbGalaxyScene({
		canvas,
		camera: stage.camera,
		initialSlots,
		onHover: (slot) => (hoveredSlotId = slot?.id ?? null),
		onActivate
	});
	let stopLoop: (() => void) | null = startAnimationLoop(frame);
	const resizeObserver = fitStageTo(stage, container, renderWhileResting);

	function motionState(): SlotMotionState {
		return { isAnimated, hoveredSlotId, focusedSlotId: focus.focusedSlotId() };
	}

	function render(): void {
		stage.renderer.render(scene.galaxy().scene, stage.camera);
	}

	function frame(deltaSeconds: number, timeSeconds: number): void {
		focus.update(deltaSeconds);
		controls.update();
		animateSlotHandles(scene.galaxy().handles, deltaSeconds, timeSeconds, motionState());
		render();
	}

	function renderWhileResting(): void {
		if (stopLoop !== null) return;
		settleSlotHandles(scene.galaxy().handles, motionState());
		render();
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
		renderWhileResting();
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
