import { Vector3 } from 'three';
import { isInsideBrain } from '../constellation/brainShape';
import { shareStreamFrom } from '../constellation/pseudoRandom';
import type { EdgeSeed } from './flowEdges';
import type { FlowLane, FlowNode } from './flowTypes';

const LANE_TOP = 1.5;
const LANE_BOTTOM = -1.2;
const FRONT_Z = 2.9;
const BACK_Z = -2.7;
const SOURCE_Z = 4.4;
const SINK_Z = -4.2;
const CLEAR_OF_FISSURE = 0.45;
const STACK_STEP = 0.55;
const SIDE_JITTER = 0.3;
const SETTLE_SHARE = 0.85;
const SETTLE_ATTEMPT_LIMIT = 8;

export function laneCentres(roleCount: number): number[] {
	if (roleCount <= 1) return [(LANE_TOP + LANE_BOTTOM) / 2];
	return Array.from({ length: roleCount }, (_, index) => {
		return LANE_TOP - ((LANE_TOP - LANE_BOTTOM) * index) / (roleCount - 1);
	});
}

export function depthsOf(nodes: FlowNode[], seeds: EdgeSeed[]): Map<string, number> {
	const depths = new Map(nodes.map((node) => [node.id, node.kind === 'source' ? 0 : 1]));
	const carried = seeds.filter((seed) => seed.kind === 'flow' || seed.kind === 'handover');
	for (let pass = 0; pass < nodes.length; pass += 1) {
		let hasDeepened = false;
		for (const seed of carried) {
			const deeper = (depths.get(seed.fromId) ?? 0) + 1;
			if (deeper <= (depths.get(seed.toId) ?? 0) || deeper > nodes.length) continue;
			depths.set(seed.toId, deeper);
			hasDeepened = true;
		}
		if (!hasDeepened) break;
	}
	return depths;
}

export function placeNodes(
	nodes: FlowNode[],
	depths: Map<string, number>,
	lanes: FlowLane[],
	seedText: string
): void {
	const nextShare = shareStreamFrom(`${seedText}:flow`);
	const deepest = Math.max(1, ...[...depths.values()]);
	const stacked = new Map<string, number>();
	for (const node of nodes) {
		const depth = depths.get(node.id) ?? 1;
		const laneHeight = lanes[node.roleIndex]?.laneHeight ?? 0;
		const stackKey = `${node.kind}:${node.roleIndex}:${depth}`;
		const stackIndex = stacked.get(stackKey) ?? 0;
		stacked.set(stackKey, stackIndex + 1);
		const side = sideOffset(stackIndex, nextShare) + (nextShare() - 0.5) * SIDE_JITTER;
		node.position.set(side, laneHeight, zFor(node, depth, deepest));
		if (node.kind === 'station') settleInsideBrain(node.position);
	}
}

function zFor(node: FlowNode, depth: number, deepest: number): number {
	if (node.kind === 'source') return SOURCE_Z;
	if (node.kind === 'sink') return SINK_Z;
	return FRONT_Z - ((depth - 1) / Math.max(1, deepest - 1)) * (FRONT_Z - BACK_Z);
}

function sideOffset(stackIndex: number, nextShare: () => number): number {
	const rung = Math.floor(stackIndex / 2);
	const hand = stackIndex % 2 === 0 ? 1 : -1;
	const startsLeft = nextShare() < 0.5 ? -1 : 1;
	return startsLeft * hand * (CLEAR_OF_FISSURE + rung * STACK_STEP);
}

function settleInsideBrain(position: Vector3): void {
	for (let attempt = 0; attempt < SETTLE_ATTEMPT_LIMIT; attempt += 1) {
		if (isInsideBrain(position)) return;
		position.x *= SETTLE_SHARE;
		position.y *= SETTLE_SHARE;
	}
}
