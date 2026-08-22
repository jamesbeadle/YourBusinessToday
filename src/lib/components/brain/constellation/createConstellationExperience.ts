import { startAnimationLoop } from '../../stage/animationLoop';
import { createStage, fitStageTo } from '../../stage/createStage';
import { assembleConstellationScene } from './constellationSceneAssembly';
import { attachExperienceInput } from './experienceInput';
import { createFocusDirector } from './focusDirector';
import { createGrowthChoreographer } from './growthChoreographer';
import { bodySlugsOf, newcomerSlugs } from './modelNewcomers';
import { createOrbitRig, prefersReducedMotion } from './orbitRig';
import type { ConstellationCallbacks, ConstellationModel } from './constellationTypes';

const FIELD_OF_VIEW_DEGREES = 50;
const FAR_PLANE = 220;

export type ExperienceOptions = { shouldCascadeInitialModel?: boolean };

export type ConstellationExperience = {
	updateModel: (model: ConstellationModel) => void;
	focusContext: (contextSlug: string | null) => void;
	focusNeuron: (slug: string) => void;
	resetView: () => void;
	destroy: () => void;
};

export function createConstellationExperience(
	canvas: HTMLCanvasElement,
	container: HTMLElement,
	model: ConstellationModel,
	callbacks: ConstellationCallbacks,
	options: ExperienceOptions = {}
): ConstellationExperience {
	const isAnimated = !prefersReducedMotion();
	const stage = createStage(canvas, {
		fieldOfViewDegrees: FIELD_OF_VIEW_DEGREES,
		farPlane: FAR_PLANE
	});
	const view = assembleConstellationScene(model);
	const controls = createOrbitRig(stage.camera, canvas);
	const director = createFocusDirector({ camera: stage.camera, controls, view, model, isAnimated });
	const growth = createGrowthChoreographer({
		bodyFor: (slug) => view.field.bodyFor(slug),
		strandsTouching: (slug) => view.web.strandsTouching(slug),
		flashes: view.flashes,
		isAnimated
	});
	const detachPointer = attachExperienceInput({
		canvas,
		camera: stage.camera,
		hitTargetsFor: () => view.field.hitTargets,
		callbacks,
		director
	});
	view.pulses.group.visible = isAnimated;
	if (options.shouldCascadeInitialModel) growth.plan(bodySlugsOf(model));
	const resizeObserver = fitStageTo(stage, container);
	let knownModel = model;

	function frame(deltaSeconds: number, timeSeconds: number): void {
		director.update(deltaSeconds);
		controls.update();
		growth.update(deltaSeconds);
		view.flashes.update(deltaSeconds);
		if (isAnimated) view.field.twinkle(timeSeconds);
		if (isAnimated) view.skins.tick(timeSeconds);
		if (isAnimated) view.pulses.update(deltaSeconds);
		stage.renderer.render(view.scene, stage.camera);
	}

	const stopLoop = startAnimationLoop(frame);

	function updateModel(updatedModel: ConstellationModel): void {
		if (updatedModel === knownModel) return;
		const newcomers = newcomerSlugs(knownModel, updatedModel);
		knownModel = updatedModel;
		view.rebuild(updatedModel);
		view.pulses.group.visible = isAnimated;
		director.refresh(updatedModel);
		growth.plan(newcomers);
	}

	function destroy(): void {
		stopLoop();
		detachPointer();
		resizeObserver.disconnect();
		controls.dispose();
		view.dispose();
		stage.dispose();
	}

	return {
		updateModel,
		focusContext: director.focusContext,
		focusNeuron: director.focusNeuron,
		resetView: () => director.focusContext(null),
		destroy
	};
}
