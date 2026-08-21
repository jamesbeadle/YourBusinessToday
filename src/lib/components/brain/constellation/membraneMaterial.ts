import { AdditiveBlending, Color, ShaderMaterial } from 'three';

const MEMBRANE_VERTEX_SHADER = `
	uniform float timeSeconds;
	varying float rimShare;

	const float WOBBLE_SHARE = 0.06;
	const float WOBBLE_SPEED = 1.3;
	const vec3 WOBBLE_PHASE = vec3(9.0, 7.0, 8.0);
	const float RIM_TIGHTNESS = 2.2;

	void main() {
		float wobble = sin(timeSeconds * WOBBLE_SPEED + dot(position, WOBBLE_PHASE));
		vec3 swollen = position * (1.0 + WOBBLE_SHARE * wobble);
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

	const float INTERIOR_HAZE = 0.08;

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
		this.exposeOpacityAsUniform();
	}

	setTime(timeSeconds: number): void {
		this.uniforms.timeSeconds.value = timeSeconds;
	}

	private exposeOpacityAsUniform(): void {
		Object.defineProperty(this, 'opacity', {
			get: () => this.uniforms.membraneOpacity.value as number,
			set: (value: number) => {
				this.uniforms.membraneOpacity.value = value;
			}
		});
	}
}
