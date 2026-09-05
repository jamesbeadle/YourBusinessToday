import { describe, expect, it } from 'vitest';
import {
	brainToolsRank,
	DashboardTools,
	knowledgeBaseToolsRank,
	type DashboardTool
} from './dashboardTools.svelte';
import type { Snippet } from 'svelte';

const noPanel = (() => {}) as unknown as Snippet;

function tool(key: string): DashboardTool {
	return { key, label: key, iconPaths: [], panel: noPanel };
}

function keysOf(tools: DashboardTool[]): string[] {
	return tools.map((candidate) => candidate.key);
}

const knowledgeBaseTools = [tool('interview'), tool('documents')];
const brainTools = [tool('ask'), tool('model')];

describe('DashboardTools', () => {
	it('shows the brain tools over the knowledge base tools whichever registers first', () => {
		const dashboardTools = new DashboardTools();
		dashboardTools.register('brain', brainTools, brainToolsRank);
		dashboardTools.register('knowledge-base', knowledgeBaseTools, knowledgeBaseToolsRank);
		expect(keysOf(dashboardTools.tools)).toEqual(['ask', 'model']);
	});

	it('falls back to the knowledge base tools once the brain releases its own', () => {
		const dashboardTools = new DashboardTools();
		dashboardTools.register('knowledge-base', knowledgeBaseTools, knowledgeBaseToolsRank);
		dashboardTools.register('brain', brainTools, brainToolsRank);
		dashboardTools.release('brain');
		expect(keysOf(dashboardTools.tools)).toEqual(['interview', 'documents']);
	});

	it('shows the latest registration among equal ranks', () => {
		const dashboardTools = new DashboardTools();
		dashboardTools.register('expertise-brain-1', brainTools, brainToolsRank);
		dashboardTools.register('process-brain-2', [tool('map')], brainToolsRank);
		expect(keysOf(dashboardTools.tools)).toEqual(['map']);
	});

	it('closes the open panel when its tool is no longer on show', () => {
		const dashboardTools = new DashboardTools();
		dashboardTools.register('knowledge-base', knowledgeBaseTools, knowledgeBaseToolsRank);
		dashboardTools.register('brain', brainTools, brainToolsRank);
		dashboardTools.open('ask');
		dashboardTools.release('brain');
		expect(dashboardTools.activeKey).toBeNull();
		expect(dashboardTools.tools).toHaveLength(2);
	});

	it('shows nothing once every owner has released', () => {
		const dashboardTools = new DashboardTools();
		dashboardTools.register('knowledge-base', knowledgeBaseTools, knowledgeBaseToolsRank);
		dashboardTools.release('knowledge-base');
		expect(dashboardTools.tools).toEqual([]);
	});
});
