import { Vector2 } from 'three';
import { startAnimationLoop } from './animationLoop';
import { createStage, fitStageTo, type Stage } from './createStage';
import { EMERGE_SECONDS, FACE_CAMERA_DISTANCE } from './diveChoreography';
import type { ExpressionName } from './expressionLibrary';
import { FaceWorld } from './faceWorld';
import { MazeWorld } from './mazeWorld';
import type { ExperienceListeners, ExperienceMode } from './experienceTypes';
import { advanceDiveIn, advanceDiveOut } from './transitionFrames';

export class FaceExperience {
	private stage: Stage;
	private faceWorld = new FaceWorld();
	private mazeWorld = new MazeWorld();
	private listeners: ExperienceListeners;
	private mode: ExperienceMode = 'face';
	private transitionProgress = 0;
	private emergeRemaining = 0;
	private pointer = new Vector2();
	private stopLoop: () => void;
	private resizeObserver: ResizeObserver;

	constructor(canvas: HTMLCanvasElement, container: HTMLElement, listeners: ExperienceListeners) {
		this.listeners = listeners;
		this.stage = createStage(canvas);
		this.stage.camera.position.z = FACE_CAMERA_DISTANCE;
		this.resizeObserver = fitStageTo(this.stage, container);
		this.stopLoop = startAnimationLoop((delta, time) => this.frame(delta, time));
	}

	private switchMode(mode: ExperienceMode): void {
		this.mode = mode;
		this.transitionProgress = 0;
		this.listeners.onModeChange(mode);
	}

	private frame(deltaSeconds: number, timeSeconds: number): void {
		this.emergeRemaining = Math.max(0, this.emergeRemaining - deltaSeconds);
		const isFaceward = this.mode === 'face' || this.mode === 'divingIn';
		if (isFaceward) this.faceWorld.update(deltaSeconds, timeSeconds);
		if (!isFaceward) this.mazeWorld.update(deltaSeconds, timeSeconds, this.stage.camera);
		this.advanceTransition(deltaSeconds);
		const world = isFaceward ? this.faceWorld : this.mazeWorld;
		this.stage.renderer.render(world.scene, this.stage.camera);
	}

	private advanceTransition(deltaSeconds: number): void {
		if (this.mode === 'face' || this.mode === 'inside') {
			this.listeners.onFade(this.emergeRemaining / EMERGE_SECONDS);
			return;
		}
		const advance = this.mode === 'divingIn' ? advanceDiveIn : advanceDiveOut;
		const result = advance(
			{ camera: this.stage.camera, faceWorld: this.faceWorld, onFade: this.listeners.onFade },
			this.transitionProgress,
			deltaSeconds
		);
		this.transitionProgress = result.progress;
		if (!result.isFinished) return;
		this.emergeRemaining = EMERGE_SECONDS;
		this.switchMode(this.mode === 'divingIn' ? 'inside' : 'face');
	}

	setExpression(name: ExpressionName): void {
		this.faceWorld.setExpression(name);
	}

	speak(sentence: string): void {
		this.faceWorld.speak(sentence);
	}

	dive(): void {
		if (this.mode === 'face') this.switchMode('divingIn');
	}

	returnToFace(): void {
		if (this.mode === 'inside') this.switchMode('divingOut');
	}

	handlePointer(x: number, y: number): void {
		this.pointer.set(x, y);
		this.faceWorld.setPointer(x, y);
		this.mazeWorld.setSteer(x, y);
	}

	handleClick(): string | null {
		if (this.mode === 'face') {
			this.dive();
			return null;
		}
		if (this.mode !== 'inside') return null;
		return this.mazeWorld.pickPortalUrl(this.pointer, this.stage.camera);
	}

	destroy(): void {
		this.stopLoop();
		this.resizeObserver.disconnect();
		this.stage.dispose();
	}
}
