import { AdditiveBlending, Color, ShaderMaterial } from 'three';
import { exposeOpacityAsUniform } from './uniformOpacity';

const MEMBRANE_VERTEX_SHADER = `
	uniform float timeSeconds;
	varying float rimShare;

	const float SWELL_SHARE = 0.025;
	const float RIPPLE_SHARE = 0.02;
	const vec3 SWELL_GRAIN = vec3(2.0, 1.5, 1.8);
	const vec3 RIPPLE_GRAIN = vec3(9.0, 7.0, 8.0);
	const float RIM_TIGHTNESS = 2.2;

	float breathing(vec3 point) {
		return SWELL_SHARE * sin(timeSeconds * 0.9 + dot(point, SWELL_GRAIN))
			+ RIPPLE_SHARE * sin(timeSeconds * 1.3 - dot(point, RIPPLE_GRAIN));
	}

	void main() {
		vec3 swollen = position * (1.0 + breathing(position));
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
	constructor(colour: number) {
		super({
			uniforms: {
				membraneColour: { value: new Color(colour) },
				membraneOpacity: { value: 1 },
				timeSeconds: { value: 0 }
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
