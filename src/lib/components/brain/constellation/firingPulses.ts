import { AdditiveBlending, Group, Sprite, SpriteMaterial, type Texture } from 'three';
import { CHALK } from './constellationPalette';
import type { SampledCurve } from './synapseWeb';

const PULSE_LIMIT = 20;
const PULSES_PER_CURVE = 0.4;
const PULSE_SCALE = 0.3;
const SLOWEST_SPEED = 0.2;
const SPEED_SPREAD = 0.35;
const PULSE_OPACITY = 0.9;

type Pulse = { sprite: Sprite; curve: SampledCurve; progress: number; speed: number };

export type FiringPulses = {
	group: Group;
	update: (deltaSeconds: number) => void;
	setFocus: (contextKey: string | null) => void;
	dispose: () => void;
};

export function createFiringPulses(curves: SampledCurve[], glowTexture: Texture): FiringPulses {
	const group = new Group();
	const material = new SpriteMaterial({
		map: glowTexture,
		color: CHALK,
		transparent: true,
		opacity: PULSE_OPACITY,
		blending: AdditiveBlending,
		depthWrite: false
	});
	let focusKey: string | null = null;

	function curvesInFocus(): SampledCurve[] {
		if (focusKey === null) return curves;
		const focused = curves.filter((curve) => curve.contextKey === focusKey);
		return focused.length > 0 ? focused : curves;
	}

	function randomCurve(): SampledCurve {
		const pool = curvesInFocus();
		return pool[Math.floor(Math.random() * pool.length)];
	}

	const pulseCount = Math.min(PULSE_LIMIT, Math.ceil(curves.length * PULSES_PER_CURVE));
	const pulses: Pulse[] = Array.from({ length: pulseCount }, () => {
		const sprite = new Sprite(material);
		sprite.scale.setScalar(PULSE_SCALE);
		group.add(sprite);
		return {
			sprite,
			curve: randomCurve(),
			progress: Math.random(),
			speed: SLOWEST_SPEED + Math.random() * SPEED_SPREAD
		};
	});

	function update(deltaSeconds: number): void {
		for (const pulse of pulses) {
			pulse.progress += pulse.speed * deltaSeconds;
			if (pulse.progress >= 1) {
				pulse.progress = 0;
				pulse.curve = randomCurve();
			}
			placeAlongCurve(pulse);
		}
	}

	function setFocus(contextKey: string | null): void {
		focusKey = contextKey;
	}

	function dispose(): void {
		material.dispose();
	}

	return { group, update, setFocus, dispose };
}

function placeAlongCurve(pulse: Pulse): void {
	const points = pulse.curve.points;
	const exactIndex = pulse.progress * (points.length - 1);
	const lowerIndex = Math.floor(exactIndex);
	const upperIndex = Math.min(points.length - 1, lowerIndex + 1);
	const blend = exactIndex - lowerIndex;
	pulse.sprite.position.lerpVectors(points[lowerIndex], points[upperIndex], blend);
}
