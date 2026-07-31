import { BufferAttribute, BufferGeometry, Group, Points } from 'three';
import type { LineSegments, ShaderMaterial } from 'three';
import { buildBrows } from './buildBrows';
import { buildEyes } from './buildEyes';
import { buildHeadShell } from './buildHeadShell';
import { buildMouth } from './buildMouth';
import { buildNoseAndEars } from './buildNoseAndEars';
import { buildShoulders } from './buildShoulders';
import { FacePalette } from './facePalette';
import { FaceRig } from './faceRig';
import { createLatticeLines, nearestNeighbourEdges } from './latticeEdges';
import { ParticleCollection } from './particleCollection';
import { createParticleMaterial } from './particleMaterial';

const HEAD_NEIGHBOURS = 3;
const SHOULDER_NEIGHBOURS = 3;
const HEAD_LATTICE_OPACITY = 0.2;
const SHOULDER_LATTICE_OPACITY = 0.16;

export type AssembledFace = {
	group: Group;
	material: ShaderMaterial;
	rig: FaceRig;
	lattices: LineSegments[];
};

export function assembleFace(): AssembledFace {
	const collection = new ParticleCollection();
	const headNodes = buildHeadShell(collection);
	const shoulderNodes = buildShoulders(collection);
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

	const headLattice = createLatticeLines(
		headNodes, nearestNeighbourEdges(headNodes, HEAD_NEIGHBOURS),
		FacePalette.wire, HEAD_LATTICE_OPACITY
	);
	const shoulderLattice = createLatticeLines(
		shoulderNodes, nearestNeighbourEdges(shoulderNodes, SHOULDER_NEIGHBOURS),
		FacePalette.wire, SHOULDER_LATTICE_OPACITY
	);

	const group = new Group();
	group.add(points, headLattice, shoulderLattice);

	return {
		group,
		material,
		rig: new FaceRig(geometry, collection),
		lattices: [headLattice, shoulderLattice]
	};
}
