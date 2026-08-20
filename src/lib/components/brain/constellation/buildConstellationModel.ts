import { Vector3 } from 'three';
import { pseudoRandomFrom } from './pseudoRandom';
import { synapsesOf } from './synapseModel';
import type { BrainContext, BrainPageLink, BrainPageSummary } from '$lib/data/brainTypes';
import type { ConstellationModel, Neuron, Nucleus } from './constellationTypes';

const GOLDEN_ANGLE_RADIANS = Math.PI * (3 - Math.sqrt(5));
const CONTEXT_RING_RADIUS = 7;
const CONTEXT_RING_FLATTENING = 0.45;
const CLUSTER_BASE_RADIUS = 1.5;
const CLUSTER_GROWTH_PER_PAGE = 0.1;
const CLUSTER_DEPTH_NEAREST = 0.7;
const CLUSTER_DEPTH_SPREAD = 0.6;
const STRAY_ORBIT_RADIUS = 3;

export function buildConstellationModel(
	contexts: BrainContext[],
	pageIndex: BrainPageSummary[],
	pageLinks: BrainPageLink[]
): ConstellationModel {
	const nuclei = contexts.map((context, index) => asNucleus(context, index, contexts, pageIndex));
	const neurons = pageIndex.map((page) => asNeuron(page, nuclei, pageIndex));
	return { nuclei, neurons, synapses: synapsesOf(neurons, nuclei, pageLinks) };
}

export function sphereDirection(index: number, count: number): Vector3 {
	if (count <= 1) return new Vector3(0, 0, 1);
	const altitude = 1 - (2 * (index + 0.5)) / count;
	const ringRadius = Math.sqrt(Math.max(0, 1 - altitude * altitude));
	const angle = index * GOLDEN_ANGLE_RADIANS;
	return new Vector3(Math.cos(angle) * ringRadius, altitude, Math.sin(angle) * ringRadius);
}

function asNucleus(
	context: BrainContext,
	index: number,
	contexts: BrainContext[],
	pageIndex: BrainPageSummary[]
): Nucleus {
	const ringRadius = contexts.length <= 1 ? 0 : CONTEXT_RING_RADIUS;
	const position = sphereDirection(index, contexts.length).multiplyScalar(ringRadius);
	position.y *= CONTEXT_RING_FLATTENING;
	const pageCount = pageIndex.filter((page) => page.contextSlug === context.slug).length;
	return {
		slug: context.slug,
		name: context.name,
		summary: context.summary,
		isCoreDomain: context.isCoreDomain,
		position,
		clusterRadius: clusterRadiusFor(pageCount)
	};
}

function clusterRadiusFor(pageCount: number): number {
	return CLUSTER_BASE_RADIUS + CLUSTER_GROWTH_PER_PAGE * Math.sqrt(pageCount);
}

function asNeuron(page: BrainPageSummary, nuclei: Nucleus[], pageIndex: BrainPageSummary[]): Neuron {
	const nucleus = nuclei.find((candidate) => candidate.slug === page.contextSlug);
	const centre = nucleus?.position ?? new Vector3();
	const orbitRadius = nucleus?.clusterRadius ?? STRAY_ORBIT_RADIUS;
	const siblings = pageIndex.filter((candidate) => candidate.contextSlug === page.contextSlug);
	const rank = siblings.findIndex((candidate) => candidate.slug === page.slug);
	const depth = CLUSTER_DEPTH_NEAREST + CLUSTER_DEPTH_SPREAD * pseudoRandomFrom(page.slug);
	const offset = sphereDirection(rank, siblings.length).multiplyScalar(orbitRadius * depth);
	return { ...page, position: centre.clone().add(offset), contextSlug: nucleus?.slug ?? null };
}
