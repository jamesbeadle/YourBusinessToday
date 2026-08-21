import { Vector3 } from 'three';
import type { BodyProportions } from './neuronProportions';

const TRUNK_SEGMENT_SHARES = [0.45, 0.35, 0.2];
const TWIG_SEGMENT_SHARES = [0.6, 0.4];
const TWIG_LENGTH_SHARE = 0.45;
const TWIG_CHANCE = 0.7;
const TRUNK_WOBBLE = 0.35;
const TWIG_SPREAD = 0.85;
const FILLER_REACH_SHARE = 0.65;

export type DendriteBranch = { points: Vector3[] };

type BranchSeed = { heading: Vector3; reach: number };

export function growDendrites(
	connectionDirections: Vector3[],
	proportions: BodyProportions,
	nextShare: () => number
): DendriteBranch[] {
	const branches: DendriteBranch[] = [];
	for (const seed of branchSeeds(connectionDirections, proportions, nextShare)) {
		const origin = seed.heading.clone().multiplyScalar(proportions.somaRadius);
		const trunk = growBranch(origin, seed.heading, TRUNK_SEGMENT_SHARES, seed.reach, nextShare);
		branches.push(trunk, ...twigsAlong(trunk, seed.reach, nextShare));
	}
	return branches;
}

function branchSeeds(
	connectionDirections: Vector3[],
	proportions: BodyProportions,
	nextShare: () => number
): BranchSeed[] {
	const seeds = connectionDirections
		.slice(0, proportions.connectionCap)
		.map((direction) => ({ heading: direction.clone(), reach: proportions.dendriteReach }));
	while (seeds.length < proportions.branchCountFloor) {
		seeds.push({
			heading: randomDirection(nextShare),
			reach: proportions.dendriteReach * FILLER_REACH_SHARE
		});
	}
	return seeds;
}

function growBranch(
	origin: Vector3,
	heading: Vector3,
	segmentShares: number[],
	reach: number,
	nextShare: () => number
): DendriteBranch {
	const points = [origin.clone()];
	const walker = heading.clone();
	for (const share of segmentShares) {
		wobble(walker, TRUNK_WOBBLE, nextShare);
		points.push(points[points.length - 1].clone().addScaledVector(walker, reach * share));
	}
	return { points };
}

function twigsAlong(
	trunk: DendriteBranch,
	reach: number,
	nextShare: () => number
): DendriteBranch[] {
	const twigs: DendriteBranch[] = [];
	for (let jointIndex = 1; jointIndex < trunk.points.length - 1; jointIndex += 1) {
		if (nextShare() > TWIG_CHANCE) continue;
		const heading = trunk.points[jointIndex + 1].clone().sub(trunk.points[jointIndex]).normalize();
		wobble(heading, TWIG_SPREAD, nextShare);
		const twigReach = reach * TWIG_LENGTH_SHARE;
		twigs.push(growBranch(trunk.points[jointIndex], heading, TWIG_SEGMENT_SHARES, twigReach, nextShare));
	}
	return twigs;
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
