import type { KnowledgeKind } from './knowledgeKinds';

export const allKnowledgeBasesHref = '/knowledge-base/all';

export const newKnowledgeBaseHash = '#new';

export const newKnowledgeBaseHref = `${allKnowledgeBasesHref}${newKnowledgeBaseHash}`;

export type KnowledgeBaseAction =
	| 'setArchived'
	| 'deleteKnowledgeBase'
	| 'shareKnowledgeBase'
	| 'removeShare'
	| 'createChatbot';

export function knowledgeBaseHref(knowledgeBaseId: string): string {
	return `/knowledge-base/${knowledgeBaseId}`;
}

export function brainHref(knowledgeBaseId: string, brainId: string): string {
	return `${knowledgeBaseHref(knowledgeBaseId)}/brains/${brainId}`;
}

export function newBrainHref(knowledgeBaseId: string, kind?: KnowledgeKind): string {
	const base = `${knowledgeBaseHref(knowledgeBaseId)}/brains/new`;
	return kind === undefined ? base : `${base}?kind=${kind}`;
}

export function knowledgeBaseActionHref(
	knowledgeBaseId: string,
	action: KnowledgeBaseAction
): string {
	return `${knowledgeBaseHref(knowledgeBaseId)}?/${action}`;
}
