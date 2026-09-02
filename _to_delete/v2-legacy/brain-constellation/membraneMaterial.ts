import { AdditiveBlending, Color, ShaderMaterial, Vector3 } from 'three';
import { exposeOpacityAsUniform } from './uniformOpacity';

export const TEAT_LIMIT = 12;
const TEAT_LENGTH_SHARE = 0.45;
const STRAND_DOCK_DEPTH_SHARE = 0.85;
export const STRAND_DOCK_SHARE = 1 + TEAT_LENGTH_SHARE * STRAND_DOCK_DEPTH_SHARE;

const MEMBRANE_VERTEX_SHADER = `
	uniform float timeSeconds;
	uniform vec3 teatDirections[${TEAT_LIMIT}];
	uniform int teatCount;
	varying float rimShare;

	const float SWELL_SHARE = 0.025;
	const float RIPPLE_SHARE = 0.02;
	const vec3 SWELL_GRAIN = vec3(2.0, 1.5, 1.8);
	const vec3 RIPPLE_GRAIN = vec3(9.0, 7.0, 8.0);
	const float RIM_TIGHTNESS = 2.2;
	const float TEAT_LENGTH = ${TEAT_LENGTH_SHARE.toFixed(2)};
	const float TEAT_TIGHTNESS = 14.0;

	float breathing(vec3 point) {
		return SWELL_SHARE * sin(timeSeconds * 0.9 + dot(point, SWELL_GRAIN))
			+ RIPPLE_SHARE * sin(timeSeconds * 1.3 - dot(point, RIPPLE_GRAIN));
	}

	vec3 drawnTowardsStrands(vec3 point) {
		vec3 drawn = point;
		vec3 outward = normalize(point);
		for (int index = 0; index < ${TEAT_LIMIT}; index += 1) {
			if (index >= teatCount) break;
			float alignment = max(0.0, dot(outward, teatDirections[index]));
			drawn += teatDirections[index] * (TEAT_LENGTH * pow(alignment, TEAT_TIGHTNESS));
		}
		return drawn;
	}

	void main() {
		vec3 swollen = drawnTowardsStrands(position * (1.0 + breathing(position)));
		vec4 viewPosition = modelViewMatrix * vec4(swollen, 1.0);
		vec3 viewNormal = normalize(normalMatrix * normal);
		float facingShare = abs(dot(normalize(-viewPosition.xyz), viewNormal));
		rimShare = pow(1.0 - facingShare, RIM_TIGHTNESS);
		gl_Position = projectionMatrix * viewPosition;
	}
`;

const MEMBRANE_FRAGMENT_SHADER = `
	uniform vec3 membraneColour;
	uniform float membraneOpacity;
	varying float rimShare;

	const float INTERIOR_HAZE = 0.06;

	void main() {
		gl_FragColor = vec4(membraneColour, (INTERIOR_HAZE + rimShare) * membraneOpacity);
	}
`;

export class MembraneMaterial extends ShaderMaterial {
	constructor(colour: number, teatDirections: Vector3[]) {
		super({
			uniforms: {
				membraneColour: { value: new Color(colour) },
				membraneOpacity: { value: 1 },
				timeSeconds: { value: 0 },
				teatDirections: { value: paddedDirections(teatDirections) },
				teatCount: { value: Math.min(TEAT_LIMIT, teatDirections.length) }
			},
			vertexShader: MEMBRANE_VERTEX_SHADER,
			fragmentShader: MEMBRANE_FRAGMENT_SHADER,
			transparent: true,
			blending: AdditiveBlending,
			depthWrite: false
		});
		exposeOpacityAsUniform(this, 'membraneOpacity');
	}

	setTime(timeSeconds: number): void {
		this.uniforms.timeSeconds.value = timeSeconds;
	}
}

function paddedDirections(directions: Vector3[]): Vector3[] {
	const padded = directions.slice(0, TEAT_LIMIT).map((direction) => direction.clone());
	while (padded.length < TEAT_LIMIT) padded.push(new Vector3());
	return padded;
}
