import { Color, ShaderMaterial } from 'three';
import { exposeOpacityAsUniform } from './uniformOpacity';

const SOMA_VERTEX_SHADER = `
	uniform float timeSeconds;
	varying float facingShare;
	varying float dimpleShare;

	const float DIMPLE_DEPTH = 0.06;
	const vec3 COARSE_GRAIN = vec3(7.0, 3.0, 5.0);
	const vec3 MEDIUM_GRAIN = vec3(-4.0, 9.0, 6.0);
	const vec3 FINE_GRAIN = vec3(6.0, -5.0, 11.0);

	float organicDimples(vec3 point) {
		return 0.5 * sin(dot(point, COARSE_GRAIN) + timeSeconds * 0.6)
			+ 0.3 * sin(dot(point, MEDIUM_GRAIN) - timeSeconds * 0.4)
			+ 0.2 * sin(dot(point, FINE_GRAIN) + timeSeconds * 0.9);
	}

	void main() {
		dimpleShare = organicDimples(position);
		vec3 dimpled = position + normal * (DIMPLE_DEPTH * dimpleShare);
		vec4 viewPosition = modelViewMatrix * vec4(dimpled, 1.0);
		vec3 viewNormal = normalize(normalMatrix * normal);
		facingShare = max(0.0, dot(normalize(-viewPosition.xyz), viewNormal));
		gl_Position = projectionMatrix * viewPosition;
	}
`;

const SOMA_FRAGMENT_SHADER = `
	uniform vec3 somaColour;
	uniform float somaOpacity;
	varying float facingShare;
	varying float dimpleShare;

	const float RIM_DARKNESS = 0.35;
	const float DIMPLE_SHADE = 0.22;
	const float NUCLEUS_TIGHTNESS = 3.5;
	const float NUCLEUS_BRIGHTNESS = 0.85;

	void main() {
		float lit = RIM_DARKNESS + (1.0 - RIM_DARKNESS) * facingShare;
		vec3 membraneTone = somaColour * lit * (1.0 + DIMPLE_SHADE * dimpleShare);
		float nucleusShare = pow(facingShare, NUCLEUS_TIGHTNESS) * NUCLEUS_BRIGHTNESS;
		gl_FragColor = vec4(mix(membraneTone, vec3(1.0), nucleusShare), somaOpacity);
	}
`;

export class SomaMaterial extends ShaderMaterial {
	constructor(colour: number) {
		super({
			uniforms: {
				somaColour: { value: new Color(colour) },
				somaOpacity: { value: 1 },
				timeSeconds: { value: 0 }
			},
			vertexShader: SOMA_VERTEX_SHADER,
			fragmentShader: SOMA_FRAGMENT_SHADER,
			transparent: true
		});
		exposeOpacityAsUniform(this, 'somaOpacity');
	}

	setTime(timeSeconds: number): void {
		this.uniforms.timeSeconds.value = timeSeconds;
	}
}
