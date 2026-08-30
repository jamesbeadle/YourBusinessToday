import { findKnowledgeKind, kindForCategory, knowledgeKinds } from '$lib/data/knowledge/knowledgeKinds';
import type { KbBrainSummary } from '$lib/data/knowledge/knowledgeTypes';
import type { ProcessMapSummary } from '$lib/server/knowledge/getProcessMaps';

export type ConstellationSlot = {
	id: string;
	variant: 'brain' | 'ghost';
	name: string;
	href: string;
	accent: string;
	kindLabel: string;
	category: 'domain' | 'instance' | null;
};

export function buildConstellationSlots(
	knowledgeBaseId: string,
	brains: KbBrainSummary[],
	processMaps: ProcessMapSummary[]
): ConstellationSlot[] {
	const brainSlots = brains.map((brain) => brainSlot(knowledgeBaseId, brain));
	const processSlots = processMaps.map(processSlot);
	const filled = [...brainSlots, ...processSlots];
	return [...filled, ...ghostSlots(knowledgeBaseId, filled)];
}

function brainSlot(knowledgeBaseId: string, brain: KbBrainSummary): ConstellationSlot {
	const kind = kindForCategory(brain.category);
	return {
		id: brain.id,
		variant: 'brain',
		name: brain.name,
		href: `/knowledge-base/${knowledgeBaseId}/brains/${brain.id}`,
		accent: kind.accent,
		kindLabel: kind.label,
		category: brain.category
	};
}

function processSlot(processMap: ProcessMapSummary): ConstellationSlot {
	return {
		id: processMap.id,
		variant: 'brain',
		name: processMap.name,
		href: `/workspace/${processMap.entityId}/workflows/${processMap.id}`,
		accent: findKnowledgeKind('process').accent,
		kindLabel: 'Process',
		category: null
	};
}

function ghostSlots(knowledgeBaseId: string, filled: ConstellationSlot[]): ConstellationSlot[] {
	const presentLabels = new Set(filled.map((slot) => slot.kindLabel));
	return knowledgeKinds
		.filter((kind) => !presentLabels.has(kind.label))
		.map((kind) => ({
			id: `ghost-${kind.kind}`,
			variant: 'ghost' as const,
			name: `Add ${kind.label} Brain`,
			href: `/knowledge-base/${knowledgeBaseId}/brains/new?kind=${kind.kind}`,
			accent: kind.accent,
			kindLabel: kind.label,
			category: null
		}));
}
