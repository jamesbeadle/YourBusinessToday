import { startAnimationLoop } from '../../stage/animationLoop';
import { createStage, fitStageTo, type Stage } from '../../stage/createStage';
import { constellationInteractions } from './constellationInteractions';
import { createPicker } from './constellationPicking';
import { attachConstellationPointer } from './constellationPointer';
import { assembleConstellationScene, type ConstellationScene } from './constellationSceneAssembly';
import { createFocusDirector, type FocusDirector } from './focusDirector';
import { createOrbitRig, prefersReducedMotion } from './orbitRig';
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { ConstellationCallbacks, ConstellationModel } from './constellationTypes';

const FIELD_OF_VIEW_DEGREES = 50;
const FAR_PLANE = 220;

export class ConstellationExperience {
	private stage: Stage;
	private view: ConstellationScene;
	private controls: OrbitControls;
	private director: FocusDirector;
	private stopLoop: () => void;
	private resizeObserver: ResizeObserver;
	private detachPointer: () => void;
	private isAnimated = !prefersReducedMotion();

	constructor(
		canvas: HTMLCanvasElement,
		container: HTMLElement,
		model: ConstellationModel,
		callbacks: ConstellationCallbacks
	) {
		this.stage = createStage(canvas, {
			fieldOfViewDegrees: FIELD_OF_VIEW_DEGREES,
			farPlane: FAR_PLANE
		});
		this.view = assembleConstellationScene(model);
		this.controls = createOrbitRig(this.stage.camera, canvas);
		this.director = createFocusDirector({
			camera: this.stage.camera,
			controls: this.controls,
			view: this.view,
			model,
			isAnimated: this.isAnimated
		});
		const picker = createPicker(this.stage.camera, canvas, this.view.field.hitTargets);
		this.detachPointer = attachConstellationPointer(
			canvas,
			constellationInteractions({
				canvas,
				picker,
				callbacks,
				focusContext: this.director.focusContext,
				focusNeuron: this.director.focusNeuron
			})
		);
		this.view.pulses.group.visible = this.isAnimated;
		this.resizeObserver = fitStageTo(this.stage, container);
		this.stopLoop = startAnimationLoop((delta, time) => this.frame(delta, time));
	}

	private frame(deltaSeconds: number, timeSeconds: number): void {
		this.director.update(deltaSeconds);
		this.controls.update();
		if (this.isAnimated) this.view.field.twinkle(timeSeconds);
		if (this.isAnimated) this.view.pulses.update(deltaSeconds);
		this.stage.renderer.render(this.view.scene, this.stage.camera);
	}

	focusContext(contextSlug: string | null): void {
		this.director.focusContext(contextSlug);
	}

	focusNeuron(slug: string): void {
		this.director.focusNeuron(slug);
	}

	resetView(): void {
		this.director.focusContext(null);
	}

	destroy(): void {
		this.stopLoop();
		this.detachPointer();
		this.resizeObserver.disconnect();
		this.controls.dispose();
		this.view.dispose();
		this.stage.dispose();
	}
}
