import { deleteBrainPages } from './deleteBrainPages';
import { getBrainContexts } from './getBrainContexts';
import { getBrainPageIndex, renderDomainModelIndex } from './getBrainPageIndex';
import { getDomainBrain } from '$lib/server/entities/getDomainBrain';
import { modellerPrunePrompt } from './modellerPrunePrompt';
import { parsePruneRecord } from './parsePruneRecord';
import { pruneModelTool } from './pruneModelTool';
import { readPagesResultMessage, toolUseNamed, toolUsesNamed } from './readPagesExchange';
import { readPagesTool } from './modellerAnswerTools';
import { recordBrainEvent } from './recordBrainEvent';
import { requestAnthropic } from '$lib/server/anthropic/requestAnthropic';
import { saveBrainContextWrites } from './saveBrainContextWrites';
import { saveBrainPageWrites } from './saveBrainPageWrites';
import { sweepEmptyBrainContexts } from './sweepEmptyBrainContexts';
import type { AnthropicMessage } from '$lib/server/anthropic/anthropicTypes';
import type { BrainContext, BrainPageSummary } from '$lib/data/brainTypes';
import type { DomainBrain } from '$lib/server/entities/getDomainBrain';
import type { PruneRecord } from './parsePruneRecord';
import type { SupabaseClient } from '@supabase/supabase-js';

const maxPruneTokens = 24_000;
const maxReadRounds = 3;

export type PruneOutcome = {
	logLine: string;
	pagesWritten: number;
	pagesRetired: number;
	contextsDeleted: number;
};

export async function runModelPrune(
	supabase: SupabaseClient,
	brainId: string
): Promise<PruneOutcome> {
	const brain = await getDomainBrain(supabase, brainId);
	if (brain === null) throw new Error('That expertise brain no longer exists');
	const sweptBefore = await sweepEmptyBrainContexts(supabase, brainId);
	const contexts = await getBrainContexts(supabase, brainId);
	const index = await getBrainPageIndex(supabase, brainId);
	if (index.length === 0) {
		return emptyModelOutcome(supabase, brainId, sweptBefore.length);
	}
	const record = await auditModel(supabase, brainId, brain, contexts, index);
	const appliedContextWrites = await saveBrainContextWrites(supabase, brainId, record.contextWrites);
	const appliedPageWrites = await saveBrainPageWrites(supabase, brainId, record.pageWrites);
	const deletedSlugs = await deleteBrainPages(
		supabase,
		brainId,
		retirableSlugs(record, index)
	);
	const sweptAfter = await sweepEmptyBrainContexts(supabase, brainId);
	await recordPruneEvents(supabase, brainId, appliedContextWrites, appliedPageWrites, deletedSlugs);
	const outcome = {
		logLine: record.logLine === '' ? record.findings : record.logLine,
		pagesWritten: appliedPageWrites.length,
		pagesRetired: deletedSlugs.length,
		contextsDeleted: sweptBefore.length + sweptAfter.length
	};
	await recordBrainEvent(supabase, {
		brainId,
		kind: 'model_pruned',
		detail: { ...outcome, findings: record.findings }
	});
	return outcome;
}

async function emptyModelOutcome(
	supabase: SupabaseClient,
	brainId: string,
	contextsDeleted: number
): Promise<PruneOutcome> {
	const outcome = {
		logLine:
			contextsDeleted > 0
				? 'Removed empty bounded contexts — the model holds no pages yet.'
				: 'The model is empty — nothing to prune.',
		pagesWritten: 0,
		pagesRetired: 0,
		contextsDeleted
	};
	if (contextsDeleted > 0) {
		await recordBrainEvent(supabase, { brainId, kind: 'model_pruned', detail: { ...outcome } });
	}
	return outcome;
}

async function auditModel(
	supabase: SupabaseClient,
	brainId: string,
	brain: DomainBrain,
	contexts: BrainContext[],
	index: BrainPageSummary[]
): Promise<PruneRecord> {
	const system = `${modellerPrunePrompt(brain.name, brain.domainGoal)}\n\n## Model index\n\n${renderDomainModelIndex(contexts, index)}`;
	const messages: AnthropicMessage[] = [
		{ role: 'user', content: 'Prune the model now. Read any pages you need first.' }
	];
	const tools = [readPagesTool, pruneModelTool];
	for (let round = 0; round < maxReadRounds; round += 1) {
		const response = await requestAnthropic({ system, messages, tools, maxTokens: maxPruneTokens });
		const record = parsePruneRecord(toolUseNamed(response.content, pruneModelTool.name)?.input);
		if (record !== null) return record;
		const readRequests = toolUsesNamed(response.content, readPagesTool.name);
		if (readRequests.length === 0) break;
		messages.push({ role: 'assistant', content: response.content });
		messages.push(await readPagesResultMessage(supabase, brainId, readRequests));
	}
	const finalResponse = await requestAnthropic({
		system,
		messages,
		tools,
		forcedToolName: pruneModelTool.name,
		maxTokens: maxPruneTokens
	});
	if (finalResponse.stop_reason === 'max_tokens') {
		throw new Error('Pruning ran out of room before finishing the model update');
	}
	const record = parsePruneRecord(toolUseNamed(finalResponse.content, pruneModelTool.name)?.input);
	if (record === null) throw new Error('Pruning produced no usable model update');
	return record;
}

function retirableSlugs(record: PruneRecord, index: BrainPageSummary[]): string[] {
	return record.pageRetires.filter((slug) =>
		index.some((page) => page.slug === slug && page.kind !== 'context_map')
	);
}

async function recordPruneEvents(
	supabase: SupabaseClient,
	brainId: string,
	contextWrites: { slug: string; wasCreated: boolean }[],
	pageWrites: { slug: string; wasCreated: boolean }[],
	deletedSlugs: string[]
): Promise<void> {
	for (const write of contextWrites) {
		await recordBrainEvent(supabase, {
			brainId,
			kind: write.wasCreated ? 'context_created' : 'context_updated',
			detail: { contextSlug: write.slug }
		});
	}
	for (const write of pageWrites) {
		await recordBrainEvent(supabase, {
			brainId,
			kind: write.wasCreated ? 'page_created' : 'page_updated',
			detail: {},
			pageSlug: write.slug
		});
	}
	for (const slug of deletedSlugs) {
		await recordBrainEvent(supabase, {
			brainId,
			kind: 'page_deleted',
			detail: { pageSlug: slug }
		});
	}
}
