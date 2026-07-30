import { Group, Scene, Vector2 } from 'three';
import type { LineBasicMaterial } from 'three';
import { assembleFace, type AssembledFace } from './assembleFace';
import { createBinaryRain, type BinaryRain } from './binaryRain';
import { expressionLibrary, type ExpressionName } from './expressionLibrary';
import { FacePalette } from './facePalette';
import {
	blendTowards, copyParameters, neutralParameters, type FaceRigParameters
} from './faceRigParameters';
import { IdleLife } from './idleLife';
import { setParticleOpacity } from './particleMaterial';
import { SpeakPerformance } from './speakPerformance';
import { TesseractCell } from './tesseractCell';

const PARAMETER_BLEND_RATE = 9;
const HEAD_TURN_REACH = 0.5;
const HEAD_NOD_REACH = 0.28;
const HEAD_TURN_RATE = 4;
const FACE_LIFT = 0.55;
const BRAIN_SCALE = 0.36;
const BRAIN_POSITION = { x: 0, y: 0.12, z: 0.3 };
const BRAIN_SPIN_RATE = 0.55;
const BRAIN_RESTING_GLOW = 0.4;
const BRAIN_SPEAKING_SURGE = 0.35;
const BRAIN_IDLE_FLICKER = 0.1;
const BRAIN_PULSE_RATE = 5;

export class FaceWorld {
	scene = new Scene();
	private faceGroup = new Group();
	private face: AssembledFace;
	private brain: TesseractCell;
	private rain: BinaryRain;
	private currentParameters: FaceRigParameters = copyParameters(neutralParameters);
	private expressionTarget: FaceRigParameters = copyParameters(neutralParameters);
	private speech = new SpeakPerformance();
	private idle = new IdleLife();
	private pointer = new Vector2();
	private overallOpacity = 1;

	constructor() {
		this.face = assembleFace();
		this.brain = new TesseractCell(BRAIN_SCALE, FacePalette.nodeGlow, BRAIN_RESTING_GLOW);
		this.brain.lines.position.set(BRAIN_POSITION.x, BRAIN_POSITION.y, BRAIN_POSITION.z);
		this.faceGroup.add(this.face.group, this.brain.lines);
		this.rain = createBinaryRain();
		this.scene.add(this.faceGroup, this.rain.group);
	}

	setExpression(name: ExpressionName): void {
		this.expressionTarget = copyParameters(expressionLibrary[name]);
	}

	speak(sentence: string): void {
		this.speech.start(sentence);
		if (!('speechSynthesis' in window)) return;
		window.speechSynthesis.cancel();
		window.speechSynthesis.speak(new SpeechSynthesisUtterance(sentence));
	}

	setPointer(x: number, y: number): void {
		this.pointer.set(x, y);
	}

	setOpacity(opacity: number): void {
		this.overallOpacity = opacity;
		setParticleOpacity(this.face.material, opacity);
		for (const lattice of this.face.lattices) {
			const material = lattice.material as LineBasicMaterial;
			material.opacity = (lattice.userData.baseOpacity as number) * opacity;
		}
	}

	setSpread(scale: number): void {
		this.faceGroup.scale.setScalar(scale);
	}

	update(deltaSeconds: number, timeSeconds: number): void {
		const idleState = this.idle.advance(deltaSeconds);
		const target = copyParameters(this.expressionTarget);
		const viseme = this.speech.advance(deltaSeconds);
		if (viseme) Object.assign(target, viseme);
		blendTowards(this.currentParameters, target, PARAMETER_BLEND_RATE, deltaSeconds);
		const applied = copyParameters(this.currentParameters);
		applied.eyeOpenness *= idleState.eyeScale;
		this.face.rig.applyParameters(applied, { x: this.pointer.x, y: this.pointer.y });
		const turnAmount = Math.min(1, HEAD_TURN_RATE * deltaSeconds);
		const group = this.faceGroup;
		group.rotation.y += (this.pointer.x * HEAD_TURN_REACH - group.rotation.y) * turnAmount;
		group.rotation.x += (-this.pointer.y * HEAD_NOD_REACH - group.rotation.x) * turnAmount;
		group.position.y = FACE_LIFT + idleState.breatheLift;
		this.brain.update(timeSeconds * BRAIN_SPIN_RATE, 0);
		const surge = this.speech.isSpeaking ? BRAIN_SPEAKING_SURGE : BRAIN_IDLE_FLICKER;
		const pulse = 0.5 + 0.5 * Math.sin(timeSeconds * BRAIN_PULSE_RATE);
		const brainMaterial = this.brain.lines.material as LineBasicMaterial;
		brainMaterial.opacity = (BRAIN_RESTING_GLOW + surge * pulse) * this.overallOpacity;
		this.rain.update(deltaSeconds);
	}
}
