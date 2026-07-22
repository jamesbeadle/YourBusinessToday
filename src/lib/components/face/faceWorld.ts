import { Group, Scene, Vector2 } from 'three';
import { assembleFace, type AssembledFace } from './assembleFace';
import { expressionLibrary, type ExpressionName } from './expressionLibrary';
import {
	blendTowards, copyParameters, neutralParameters, type FaceRigParameters
} from './faceRigParameters';
import { createGlyphField } from './glyphField';
import { IdleLife } from './idleLife';
import { setParticleOpacity } from './particleMaterial';
import { SpeakPerformance } from './speakPerformance';

const PARAMETER_BLEND_RATE = 9;
const HEAD_TURN_REACH = 0.5;
const HEAD_NOD_REACH = 0.28;
const HEAD_TURN_RATE = 4;
const HALO_SPIN_RATE = 0.05;
const HALO_GLYPHS_PER_CHARACTER = 90;
const HALO_GLYPH_SIZE = 0.11;
const HALO_INNER_RADIUS = 1.7;
const HALO_RADIUS_SPREAD = 1.1;
const FACE_LIFT = 0.3;

function haloPlacement(): { x: number; y: number; z: number } {
	const angle = Math.random() * Math.PI * 2;
	const radius = HALO_INNER_RADIUS + Math.random() * HALO_RADIUS_SPREAD;
	return {
		x: Math.cos(angle) * radius,
		y: (Math.random() * 2 - 1) * 1.1,
		z: Math.sin(angle) * radius
	};
}

export class FaceWorld {
	scene = new Scene();
	private faceGroup = new Group();
	private face: AssembledFace;
	private halo: Group;
	private currentParameters: FaceRigParameters = copyParameters(neutralParameters);
	private expressionTarget: FaceRigParameters = copyParameters(neutralParameters);
	private speech = new SpeakPerformance();
	private idle = new IdleLife();
	private pointer = new Vector2();

	constructor() {
		this.face = assembleFace();
		this.faceGroup.add(this.face.points);
		this.halo = createGlyphField(
			HALO_GLYPHS_PER_CHARACTER, HALO_GLYPH_SIZE, '#2fd48a', 0.35, haloPlacement
		);
		this.scene.add(this.faceGroup, this.halo);
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
		setParticleOpacity(this.face.material, opacity);
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
		this.halo.rotation.y = timeSeconds * HALO_SPIN_RATE;
	}
}
