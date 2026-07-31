import { Group, Scene, Vector2 } from 'three';
import { expressionLibrary, type ExpressionName } from './expressionLibrary';
import {
	blendTowards, copyParameters, neutralParameters, type FaceRigParameters
} from './faceRigParameters';
import { IdleLife } from './idleLife';
import { createReliefBackdrop } from './reliefBackdrop';
import { createReliefLighting } from './reliefLighting';
import { SpeakPerformance } from './speakPerformance';
import { createSpeckleField, type SpeckleField } from './speckleField';
import { buildVoxelFace } from './voxelFace';
import { VoxelRig } from './voxelRig';

const PARAMETER_BLEND_RATE = 9;
const HEAD_TURN_REACH = 0.24;
const HEAD_NOD_REACH = 0.14;
const HEAD_TURN_RATE = 4;
const FACE_LIFT = 0.06;

export class FaceWorld {
	scene = new Scene();
	private faceGroup = new Group();
	private rig: VoxelRig;
	private speckles: SpeckleField;
	private currentParameters: FaceRigParameters = copyParameters(neutralParameters);
	private expressionTarget: FaceRigParameters = copyParameters(neutralParameters);
	private speech = new SpeakPerformance();
	private idle = new IdleLife();
	private pointer = new Vector2();

	constructor() {
		this.scene.background = createReliefBackdrop();
		const face = buildVoxelFace();
		this.rig = new VoxelRig(face.mesh, face.placements);
		this.speckles = createSpeckleField();
		this.faceGroup.add(face.mesh);
		this.scene.add(this.faceGroup, this.speckles.mesh, createReliefLighting());
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

	setPointer(across: number, up: number): void {
		this.pointer.set(across, up);
	}

	update(deltaSeconds: number, timeSeconds: number): void {
		const idleState = this.idle.advance(deltaSeconds);
		const target = copyParameters(this.expressionTarget);
		const viseme = this.speech.advance(deltaSeconds);
		if (viseme) Object.assign(target, viseme);
		blendTowards(this.currentParameters, target, PARAMETER_BLEND_RATE, deltaSeconds);
		this.rig.applyParameters(this.currentParameters, {
			openness: this.currentParameters.eyeOpenness * idleState.eyeScale,
			gazeAcross: this.pointer.x,
			gazeUp: this.pointer.y
		});
		this.turnHead(deltaSeconds, idleState.breatheLift);
		this.speckles.drift(timeSeconds);
	}

	private turnHead(deltaSeconds: number, breatheLift: number): void {
		const turnAmount = Math.min(1, HEAD_TURN_RATE * deltaSeconds);
		const group = this.faceGroup;
		group.rotation.y += (this.pointer.x * HEAD_TURN_REACH - group.rotation.y) * turnAmount;
		group.rotation.x += (-this.pointer.y * HEAD_NOD_REACH - group.rotation.x) * turnAmount;
		group.position.y = FACE_LIFT + breatheLift;
	}
}
