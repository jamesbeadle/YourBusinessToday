import { parseWorkflowModel } from '$lib/server/agent/parseWorkflowModel';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { WorkflowModel } from '$lib/data/workflowModel';

export type SharedMapSummary = {
	ownerId: string;
	ownerEmail: string;
	version: number;
	updatedAt: string;
};

export async function getSharedMapSummaries(
	supabase: SupabaseClient
): Promise<SharedMapSummary[]> {
	const { data, error } = await supabase.rpc('shared_maps_for_viewer');
	if (error) throw error;
	return data.map((row: Record<string, unknown>) => ({
		ownerId: row.owner_id as string,
		ownerEmail: row.owner_email as string,
		version: row.version as number,
		updatedAt: row.updated_at as string
	}));
}

export async function getSharedMap(
	supabase: SupabaseClient,
	ownerId: string
): Promise<WorkflowModel | null> {
	const { data, error } = await supabase.rpc('get_shared_map', { map_owner_id: ownerId });
	if (error === null) return parseWorkflowModel(data);
	if (error.message.includes('not_shared')) return null;
	throw error;
}
