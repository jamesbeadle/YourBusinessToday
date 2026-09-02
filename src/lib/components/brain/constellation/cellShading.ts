import { UniformsLib, UniformsUtils, Vector3, type IUniform } from 'three';

const KEY_LIGHT_DIRECTION = new Vector3(-0.35, 0.65, 0.68).normalize();

export type SharedCellUniforms = {
	timeSeconds: IUniform<number>;
	viewportHeightPixels: IUniform<number>;
};

export function createSharedCellUniforms(): SharedCellUniforms {
	return { timeSeconds: { value: 0 }, viewportHeightPixels: { value: 1 } };
}

export function fogUniforms(): Record<string, IUniform> {
	return UniformsUtils.clone(UniformsLib.fog);
}

export const CELL_SHADING_GLSL = `
	const vec3 KEY_LIGHT_DIRECTION = ${glslVector3(KEY_LIGHT_DIRECTION)};
	const float AMBIENT_LIGHT = 0.18;
	const float KEY_LIGHT = 0.55;
	const float BACKLIGHT = 0.35;
	const float RIM_TIGHTNESS = 2.2;
	const float RIM_LIGHT = 0.95;
	const float RIM_WHITENESS = 0.6;

	vec3 shadeCell(vec3 cellColour, vec3 viewNormal, vec3 towardsEye) {
		float lambert = max(0.0, dot(viewNormal, KEY_LIGHT_DIRECTION));
		float backlit = pow(max(0.0, dot(-viewNormal, KEY_LIGHT_DIRECTION)), 2.0);
		float facing = max(0.0, dot(viewNormal, towardsEye));
		float rim = pow(1.0 - facing, RIM_TIGHTNESS);
		vec3 rimColour = mix(cellColour, vec3(1.0), RIM_WHITENESS);
		vec3 lit = cellColour * (AMBIENT_LIGHT + KEY_LIGHT * lambert + BACKLIGHT * backlit);
		return lit + rimColour * (RIM_LIGHT * rim);
	}

	vec3 faceTowardsEye(vec3 viewNormal) {
		return gl_FrontFacing ? viewNormal : -viewNormal;
	}
`;

function glslVector3(vector: Vector3): string {
	return `vec3(${vector.x.toFixed(5)}, ${vector.y.toFixed(5)}, ${vector.z.toFixed(5)})`;
}
