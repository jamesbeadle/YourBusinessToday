import { Color, Matrix4, type InstancedMesh } from 'three';
import { displacementFor, verticalStretchFor } from './cubeDisplacement';
import type { CubePlacement } from './cubePlacements';
import { eyeShadeAt, type EyeLook } from './eyeShading';
import type { FaceRigParameters } from './faceRigParameters';
import { colourForShade } from './reliefShade';
import { mixTowards } from './reliefShapes';

const MOVES_ABOVE = 0.01;
const RECOLOURS_ABOVE = 0.04;
const CAVITY_SHADE = 0.03;
const CAVITY_SPREAD = 1.6;

function canMove(placement: CubePlacement): boolean {
	const weights = placement.weights;
	return (
		weights.jaw > MOVES_ABOVE ||
		weights.lip > MOVES_ABOVE ||
		weights.brow > MOVES_ABOVE ||
		weights.cavity > MOVES_ABOVE
	);
}

function canRecolour(placement: CubePlacement): boolean {
	const weights = placement.weights;
	return weights.eyeNearness > RECOLOURS_ABOVE || weights.cavity > RECOLOURS_ABOVE;
}

export class VoxelRig {
	private mesh: InstancedMesh;
	private placements: CubePlacement[];
	private movers: number[] = [];
	private recolourers: number[] = [];
	private matrix = new Matrix4();
	private colour = new Color();

	constructor(mesh: InstancedMesh, placements: CubePlacement[]) {
		this.mesh = mesh;
		this.placements = placements;
		placements.forEach((placement, index) => {
			if (canMove(placement)) this.movers.push(index);
			if (canRecolour(placement)) this.recolourers.push(index);
		});
	}

	private moveCube(index: number, parameters: FaceRigParameters): void {
		const placement = this.placements[index];
		const offset = displacementFor(placement.across, placement.weights, parameters);
		const stretch = verticalStretchFor(placement.weights, parameters);
		this.matrix.makeScale(placement.size, placement.size * stretch, placement.size);
		this.matrix.setPosition(
			placement.across + offset.across,
			placement.up + offset.up,
			placement.depth + offset.depth
		);
		this.mesh.setMatrixAt(index, this.matrix);
	}

	private recolourCube(index: number, parameters: FaceRigParameters, look: EyeLook): void {
		const placement = this.placements[index];
		const opened = Math.min(1, placement.weights.cavity * CAVITY_SPREAD) * parameters.jawOpen;
		const hollowed = mixTowards(placement.shade, CAVITY_SHADE, opened);
		const looked = eyeShadeAt(placement.across, placement.up, hollowed, look);
		this.mesh.setColorAt(index, colourForShade(looked, this.colour));
	}

	applyParameters(parameters: FaceRigParameters, look: EyeLook): void {
		for (const index of this.movers) this.moveCube(index, parameters);
		for (const index of this.recolourers) this.recolourCube(index, parameters, look);
		this.mesh.instanceMatrix.needsUpdate = true;
		if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
	}
}
