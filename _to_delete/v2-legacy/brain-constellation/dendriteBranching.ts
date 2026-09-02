import { CatmullRomCurve3, Vector3 } from 'three';
import { membraneRadiusOf } from './cellSoma';
import { clampShare } from './growthShares';
import type { BodyProportions } from './neuronProportions';

const TRUNK_SEGMENT_SHARES = [0.3, 0.25, 0.2, 0.15, 0.1];
const TWIG_SEGMENT_SHARES = [0.45, 0.3, 0.25];
const TWIGLET_SEGMENT_SHARES = [0.6, 0.4];
const TWIG_LENGTH_SHARE = 0.5;
const TWIGLET_LENGTH_SHARE = 0.45;
const SPARSEST_TWIG_CHANCE = 0.45;
const TWIG_CHANCE_SPREAD = 0.45;
const TWIGLET_CHANCE = 0.5;
const TRUNK_WOBBLE = 0.3;
const TWIG_SPREAD = 0.85;
const TWIGLET_SPREAD = 0.7;
const FREE_REACH_SHARE = 0.75;
const CONNECTION_CLEARANCE_COSINE = 0.8;
const CLEARANCE_ATTEMPT_LIMIT = 8;
const SAMPLES_PER_CONTROL_POINT = 3;

export type DendriteBranch = { points: Vector3[] };

type BranchSeed = { heading: Vector3; reach: number };

export function growDendrites(
	slug: string,
	connectionDirections: Vector3[],
	proportions: BodyProportions,
	nextShare: () => number
): DendriteBranch[] {
	const richness = clampShare(connectionDirections.length / proportions.branchCountCeiling);
	const twigChance = SPARSEST_TWIG_CHANCE + TWIG_CHANCE_SPREAD * richness;
	const branches: DendriteBranch[] = [];
	for (const seed of branchSeeds(connectionDirections, proportions, nextShare)) {
		const origin = seed.heading.clone().multiplyScalar(membraneRadiusOf(slug, proportions));
		const trunk = growBranch(origin, seed.heading, TRUNK_SEGMENT_SHARES, seed.reach, TRUNK_WOBBLE, nextShare);
		branches.push(trunk);
		for (const twig of sproutsAlong(trunk, seed.reach * TWIG_LENGTH_SHARE, TWIG_SEGMENT_SHARES, TWIG_SPREAD, twigChance, nextShare)) {
			branches.push(twig);
			const twigletReach = seed.reach * TWIG_LENGTH_SHARE * TWIGLET_LENGTH_SHARE;
			branches.push(...sproutsAlong(twig, twigletReach, TWIGLET_SEGMENT_SHARES, TWIGLET_SPREAD, TWIGLET_CHANCE, nextShare));
		}
	}
	return branches;
}

function branchSeeds(
	connectionDirections: Vector3[],
	proportions: BodyProportions,
	nextShare: () => number
): BranchSeed[] {
	const richness = clampShare(connectionDirections.length / proportions.branchCountCeiling);
	const seedCount = Math.round(
		proportions.branchCountFloor + (proportions.branchCountCeiling - proportions.branchCountFloor) * richness
	);
	const seeds: BranchSeed[] = [];
	while (seeds.length < seedCount) {
		seeds.push({
			heading: clearOfConnections(connectionDirections, nextShare),
			reach: proportions.dendriteReach * FREE_REACH_SHARE
		});
	}
	return seeds;
}

function clearOfConnections(connectionDirections: Vector3[], nextShare: () => number): Vector3 {
	let heading = randomDirection(nextShare);
	for (let attempt = 0; attempt < CLEARANCE_ATTEMPT_LIMIT; attempt += 1) {
		const isClear = connectionDirections.every(
			(direction) => direction.dot(heading) < CONNECTION_CLEARANCE_COSINE
		);
		if (isClear) return heading;
		heading = randomDirection(nextShare);
	}
	return heading;
}

function growBranch(
	origin: Vector3,
	heading: Vector3,
	segmentShares: number[],
	reach: number,
	wobbleSpread: number,
	nextShare: () => number
): DendriteBranch {
	const controlPoints = [origin.clone()];
	const walker = heading.clone();
	for (const share of segmentShares) {
		wobble(walker, wobbleSpread, nextShare);
		controlPoints.push(controlPoints[controlPoints.length - 1].clone().addScaledVector(walker, reach * share));
	}
	return { points: smoothed(controlPoints) };
}

function smoothed(controlPoints: Vector3[]): Vector3[] {
	const sampleCount = controlPoints.length * SAMPLES_PER_CONTROL_POINT;
	return new CatmullRomCurve3(controlPoints, false, 'centripetal').getPoints(sampleCount);
}

function sproutsAlong(
	parent: DendriteBranch,
	reach: number,
	segmentShares: number[],
	spread: number,
	chance: number,
	nextShare: () => number
): DendriteBranch[] {
	const sprouts: DendriteBranch[] = [];
	const jointStride = SAMPLES_PER_CONTROL_POINT;
	for (let jointIndex = jointStride; jointIndex < parent.points.length - 1; jointIndex += jointStride) {
		if (nextShare() > chance) continue;
		const heading = parent.points[jointIndex + 1].clone().sub(parent.points[jointIndex]).normalize();
		wobble(heading, spread, nextShare);
		sprouts.push(growBranch(parent.points[jointIndex], heading, segmentShares, reach, spread / 2, nextShare));
	}
	return sprouts;
}

function randomDirection(nextShare: () => number): Vector3 {
	const altitude = nextShare() * 2 - 1;
	const azimuth = nextShare() * Math.PI * 2;
	const ringRadius = Math.sqrt(Math.max(0, 1 - altitude * altitude));
	return new Vector3(Math.cos(azimuth) * ringRadius, altitude, Math.sin(azimuth) * ringRadius);
}

function wobble(heading: Vector3, spread: number, nextShare: () => number): void {
	heading.addScaledVector(randomDirection(nextShare), spread).normalize();
}
