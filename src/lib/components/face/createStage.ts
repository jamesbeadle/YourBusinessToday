import { PerspectiveCamera, WebGLRenderer } from 'three';
import { FacePalette } from './facePalette';

const FIELD_OF_VIEW_DEGREES = 42;
const NEAR_PLANE = 0.1;
const FAR_PLANE = 90;
const PIXEL_RATIO_LIMIT = 2;

export type Stage = {
	renderer: WebGLRenderer;
	camera: PerspectiveCamera;
	resize: (width: number, height: number) => void;
	dispose: () => void;
};

export function createStage(canvas: HTMLCanvasElement): Stage {
	const renderer = new WebGLRenderer({ canvas, antialias: true });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, PIXEL_RATIO_LIMIT));
	renderer.setClearColor(FacePalette.night);

	const camera = new PerspectiveCamera(FIELD_OF_VIEW_DEGREES, 1, NEAR_PLANE, FAR_PLANE);

	function resize(width: number, height: number): void {
		renderer.setSize(width, height, false);
		camera.aspect = width / Math.max(1, height);
		camera.updateProjectionMatrix();
	}

	return { renderer, camera, resize, dispose: () => renderer.dispose() };
}

export function fitStageTo(stage: Stage, container: HTMLElement): ResizeObserver {
	const observer = new ResizeObserver(() =>
		stage.resize(container.clientWidth, container.clientHeight)
	);
	observer.observe(container);
	stage.resize(container.clientWidth, container.clientHeight);
	return observer;
}
