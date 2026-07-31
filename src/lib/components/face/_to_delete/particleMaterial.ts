import { AdditiveBlending, ShaderMaterial } from 'three';

const vertexShader = `
	attribute float particleSize;
	varying vec3 varyingColour;
	void main() {
		varyingColour = color;
		vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
		gl_PointSize = particleSize * (16.0 / -viewPosition.z);
		gl_Position = projectionMatrix * viewPosition;
	}
`;

const fragmentShader = `
	varying vec3 varyingColour;
	uniform float opacity;
	void main() {
		float distanceFromCentre = length(gl_PointCoord - 0.5);
		float alpha = smoothstep(0.5, 0.08, distanceFromCentre) * opacity;
		if (alpha < 0.01) discard;
		gl_FragColor = vec4(varyingColour, alpha);
	}
`;

export function createParticleMaterial(): ShaderMaterial {
	return new ShaderMaterial({
		vertexShader,
		fragmentShader,
		uniforms: { opacity: { value: 1 } },
		vertexColors: true,
		transparent: true,
		depthWrite: false,
		blending: AdditiveBlending
	});
}

export function setParticleOpacity(material: ShaderMaterial, opacity: number): void {
	material.uniforms.opacity.value = opacity;
}
