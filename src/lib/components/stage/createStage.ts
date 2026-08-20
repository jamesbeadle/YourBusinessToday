import { PerspectiveCamera, WebGLRenderer } from 'three';

const DEFAULT_FIELD_OF_VIEW_DEGREES = 42;
const DEFAULT_FAR_PLANE = 90;
const NEAR_PLANE = 0.1;
const PIXEL_RATIO_LIMIT = 2;

export type StageOptions = { fieldOfViewDegrees?: number; farPlane?: number };

export type Stage = {
	renderer: WebGLRenderer;
	camera: PerspectiveCamera;
	resize: (width: number, height: number) => void;
	dispose: () => void;
};

export function createStage(canvas: HTMLCanvasElement, options: StageOptions = {}): Stage {
	const renderer = new WebGLRenderer({ canvas, antialias: true });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, PIXEL_RATIO_LIMIT));

	const fieldOfView = options.fieldOfViewDegrees ?? DEFAULT_FIELD_OF_VIEW_DEGREES;
	const farPlane = options.farPlane ?? DEFAULT_FAR_PLANE;
	const camera = new PerspectiveCamera(fieldOfView, 1, NEAR_PLANE, farPlane);

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
