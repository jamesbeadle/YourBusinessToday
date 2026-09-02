import { CELL_SHADING_GLSL } from './cellShading';

export const FIBRE_VERTEX_SHADER = `
	#include <fog_pars_vertex>
	attribute vec3 spine;
	attribute float reachShare;
	uniform float timeSeconds;
	uniform float viewportHeightPixels;
	uniform float growthShare;
	uniform float growthOrigin;
	uniform float anchoredAtBothEnds;
	varying vec3 viewNormal;
	varying vec3 viewPosition;
	varying float reach;

	const float GROWTH_EDGE = 0.08;
	const float THINNEST_PIXELS = 1.2;
	const float SWAY_REACH = 0.012;
	const vec3 SWAY_GRAIN = vec3(2.1, 2.7, 2.4);
	const vec3 SWAY_PACE = vec3(0.7, 0.9, 0.8);
	const float PI = 3.14159265;

	vec3 swayAt(vec3 worldPoint, float weight) {
		return sin(worldPoint * SWAY_GRAIN + timeSeconds * SWAY_PACE) * (SWAY_REACH * weight);
	}

	vec3 outwardAtLeastAPixel(vec3 outward, vec4 spineView) {
		float radius = length(outward);
		if (radius <= 0.0) return outward;
		float pixelSize = 2.0 * -spineView.z / (projectionMatrix[1][1] * viewportHeightPixels);
		float shownRadius = max(radius, 0.5 * THINNEST_PIXELS * pixelSize);
		return outward * (shownRadius / radius);
	}

	void main() {
		reach = reachShare;
		float distanceFromOrigin = mix(reachShare, 1.0 - reachShare, growthOrigin);
		float growthFront = growthShare * (1.0 + GROWTH_EDGE);
		float gate = 1.0 - smoothstep(growthFront - GROWTH_EDGE, growthFront, distanceFromOrigin);
		float swayWeight = mix(reachShare * reachShare, sin(PI * reachShare), anchoredAtBothEnds);
		vec3 worldSpine = (modelMatrix * vec4(spine, 1.0)).xyz;
		vec3 outward = outwardAtLeastAPixel(position - spine, modelViewMatrix * vec4(spine, 1.0));
		vec3 grown = spine + outward * gate + swayAt(worldSpine, swayWeight);
		vec4 mvPosition = modelViewMatrix * vec4(grown, 1.0);
		viewPosition = mvPosition.xyz;
		viewNormal = normalize(normalMatrix * normal);
		gl_Position = projectionMatrix * mvPosition;
		#include <fog_vertex>
	}
`;

export const FIBRE_FRAGMENT_SHADER = `
	#include <fog_pars_fragment>
	${CELL_SHADING_GLSL}
	uniform vec3 rootColour;
	uniform vec3 spanColour;
	uniform vec3 tipColour;
	uniform float dimShare;
	varying vec3 viewNormal;
	varying vec3 viewPosition;
	varying float reach;

	const float ROOT_BLEND_END = 0.45;
	const float TIP_BLEND_START = 0.55;

	vec3 tintAlong(float share) {
		vec3 leavingRoot = mix(rootColour, spanColour, smoothstep(0.0, ROOT_BLEND_END, share));
		return mix(leavingRoot, tipColour, smoothstep(TIP_BLEND_START, 1.0, share));
	}

	void main() {
		vec3 normal = faceTowardsEye(normalize(viewNormal));
		vec3 towardsEye = normalize(-viewPosition);
		vec3 shaded = shadeCell(tintAlong(reach), normal, towardsEye);
		gl_FragColor = vec4(shaded, dimShare);
		#include <fog_fragment>
		#include <colorspace_fragment>
	}
`;
