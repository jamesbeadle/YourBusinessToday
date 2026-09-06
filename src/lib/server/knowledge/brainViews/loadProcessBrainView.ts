import { getLatestWorkflowMap } from '$lib/server/maps/getLatestWorkflowMap';
import { getMapViewers, type MapViewer } from '$lib/server/maps/getMapViewers';
import type { WorkflowModel } from '$lib/data/workflowModel';
import type { SupabaseClient } from '@supabase/supabase-js';

export type ProcessBrainView = {
	kind: 'process';
	workflowId: string;
	latestMap: WorkflowModel;
	viewers: MapViewer[];
};

export async function loadProcessBrainView(
	supabase: SupabaseClient,
	workflowId: string
): Promise<ProcessBrainView> {
	const [latestMap, viewers] = await Promise.all([
		getLatestWorkflowMap(supabase, workflowId),
		getMapViewers(supabase, workflowId)
	]);
	return { kind: 'process', workflowId, latestMap, viewers };
}
