import { Color, ShaderMaterial, type IUniform } from 'three';
import { CELL_SHADING_GLSL, fogUniforms, type SharedCellUniforms } from './cellShading';

const SOMA_VERTEX_SHADER = `
	#include <fog_pars_vertex>
	uniform float timeSeconds;
	varying vec3 viewNormal;
	varying vec3 viewPosition;
	varying float dimpleShare;

	const float DIMPLE_DEPTH = 0.07;
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
		vec4 mvPosition = modelViewMatrix * vec4(dimpled, 1.0);
		viewPosition = mvPosition.xyz;
		viewNormal = normalize(normalMatrix * normal);
		gl_Position = projectionMatrix * mvPosition;
		#include <fog_vertex>
	}
`;

const SOMA_FRAGMENT_SHADER = `
	#include <fog_pars_fragment>
	${CELL_SHADING_GLSL}
	uniform vec3 cellColour;
	uniform float dimShare;
	varying vec3 viewNormal;
	varying vec3 viewPosition;
	varying float dimpleShare;

	const float DIMPLE_SHADE = 0.16;
	const float NUCLEUS_TIGHTNESS = 3.5;
	const float NUCLEUS_BRIGHTNESS = 0.8;

	void main() {
		vec3 normal = faceTowardsEye(normalize(viewNormal));
		vec3 towardsEye = normalize(-viewPosition);
		vec3 shaded = shadeCell(cellColour, normal, towardsEye) * (1.0 + DIMPLE_SHADE * dimpleShare);
		float nucleusShare = pow(max(0.0, dot(normal, towardsEye)), NUCLEUS_TIGHTNESS) * NUCLEUS_BRIGHTNESS;
		vec3 withNucleus = mix(shaded, vec3(1.0), nucleusShare);
		gl_FragColor = vec4(withNucleus, dimShare);
		#include <fog_fragment>
		#include <colorspace_fragment>
	}
`;

export class SomaMaterial extends ShaderMaterial {
	constructor(colour: number, shared: SharedCellUniforms, dimShare: IUniform<number>) {
		super({
			uniforms: {
				...fogUniforms(),
				timeSeconds: shared.timeSeconds,
				dimShare,
				cellColour: { value: new Color(colour) }
			},
			vertexShader: SOMA_VERTEX_SHADER,
			fragmentShader: SOMA_FRAGMENT_SHADER,
			fog: true
		});
	}
}
