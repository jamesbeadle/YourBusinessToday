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
	varying float threadShare;

	const float GROWTH_EDGE = 0.08;
	const float THINNEST_PIXELS = 1.1;
	const float THREAD_PIXELS = 1.5;
	const float TUBE_PIXELS = 4.0;
	const float SWAY_REACH = 0.012;
	const vec3 SWAY_GRAIN = vec3(2.1, 2.7, 2.4);
	const vec3 SWAY_PACE = vec3(0.7, 0.9, 0.8);
	const float PI = 3.14159265;

	vec3 swayAt(vec3 worldPoint, float weight) {
		return sin(worldPoint * SWAY_GRAIN + timeSeconds * SWAY_PACE) * (SWAY_REACH * weight);
	}

	float pixelSizeAt(vec4 spineView) {
		return 2.0 * -spineView.z / (projectionMatrix[1][1] * viewportHeightPixels);
	}

	vec3 outwardAtLeastAPixel(vec3 outward, float pixelSize) {
		float radius = length(outward);
		if (radius <= 0.0) return outward;
		float shownRadius = max(radius, 0.5 * THINNEST_PIXELS * pixelSize);
		return outward * (shownRadius / radius);
	}

	float threadShareOf(vec3 outward, float pixelSize) {
		float widthPixels = 2.0 * length(outward) / pixelSize;
		return 1.0 - smoothstep(THREAD_PIXELS, TUBE_PIXELS, widthPixels);
	}

	void main() {
		reach = reachShare;
		float distanceFromOrigin = mix(reachShare, 1.0 - reachShare, growthOrigin);
		float growthFront = growthShare * (1.0 + GROWTH_EDGE);
		float gate = 1.0 - smoothstep(growthFront - GROWTH_EDGE, growthFront, distanceFromOrigin);
		float swayWeight = mix(reachShare * reachShare, sin(PI * reachShare), anchoredAtBothEnds);
		vec3 worldSpine = (modelMatrix * vec4(spine, 1.0)).xyz;
		float pixelSize = pixelSizeAt(modelViewMatrix * vec4(spine, 1.0));
		vec3 outward = outwardAtLeastAPixel(position - spine, pixelSize);
		threadShare = threadShareOf(position - spine, pixelSize);
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
	uniform float brightness;
	varying vec3 viewNormal;
	varying vec3 viewPosition;
	varying float reach;
	varying float threadShare;

	const float ROOT_BLEND_END = 0.45;
	const float TIP_BLEND_START = 0.55;
	const float THREAD_GLOW = 0.65;
	const float THREAD_WHITENESS = 0.45;

	vec3 tintAlong(float share) {
		vec3 leavingRoot = mix(rootColour, spanColour, smoothstep(0.0, ROOT_BLEND_END, share));
		return mix(leavingRoot, tipColour, smoothstep(TIP_BLEND_START, 1.0, share));
	}

	void main() {
		vec3 normal = faceTowardsEye(normalize(viewNormal));
		vec3 towardsEye = normalize(-viewPosition);
		vec3 tint = tintAlong(reach);
		vec3 shaded = shadeCell(tint, normal, towardsEye);
		vec3 thread = mix(tint, vec3(1.0), THREAD_WHITENESS);
		vec3 lit = mix(shaded, thread, THREAD_GLOW * threadShare);
		gl_FragColor = vec4(lit * brightness, dimShare);
		#include <fog_fragment>
		#include <colorspace_fragment>
	}
`;
