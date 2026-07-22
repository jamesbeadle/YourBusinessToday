import { BufferAttribute, BufferGeometry, Points } from 'three';
import { buildBrows } from './buildBrows';
import { buildEyes } from './buildEyes';
import { buildHeadShell } from './buildHeadShell';
import { buildMouth } from './buildMouth';
import { buildNoseAndEars } from './buildNoseAndEars';
import { FaceRig } from './faceRig';
import { ParticleCollection } from './particleCollection';
import { createParticleMaterial } from './particleMaterial';
import type { ShaderMaterial } from 'three';

export type AssembledFace = {
	points: Points;
	material: ShaderMaterial;
	rig: FaceRig;
};

export function assembleFace(): AssembledFace {
	const collection = new ParticleCollection();
	buildHeadShell(collection);
	buildEyes(collection);
	buildBrows(collection);
	buildNoseAndEars(collection);
	buildMouth(collection);

	const geometry = new BufferGeometry();
	geometry.setAttribute('position', new BufferAttribute(new Float32Array(collection.positions), 3));
	geometry.setAttribute('color', new BufferAttribute(new Float32Array(collection.colours), 3));
	geometry.setAttribute('particleSize', new BufferAttribute(new Float32Array(collection.sizes), 1));

	const material = createParticleMaterial();
	const points = new Points(geometry, material);
	points.frustumCulled = false;

	return { points, material, rig: new FaceRig(geometry, collection) };
}
