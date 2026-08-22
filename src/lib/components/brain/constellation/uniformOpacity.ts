import type { ShaderMaterial } from 'three';

export function exposeOpacityAsUniform(material: ShaderMaterial, uniformName: string): void {
	Object.defineProperty(material, 'opacity', {
		get: () => material.uniforms[uniformName].value as number,
		set: (value: number) => {
			material.uniforms[uniformName].value = value;
		}
	});
}
