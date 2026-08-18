import type { SupabaseClient } from '@supabase/supabase-js';
import {
	parseChecklistItemRecord,
	parseChecklistRecord,
	type TaskChecklist
} from '$lib/server/projects/checklistRecord';

export async function getTaskChecklists(
	supabase: SupabaseClient,
	taskId: string
): Promise<TaskChecklist[]> {
	const checklists = await getChecklists(supabase, taskId);
	if (checklists.length === 0) return checklists;
	await fillItems(supabase, checklists);
	return checklists;
}

async function getChecklists(supabase: SupabaseClient, taskId: string): Promise<TaskChecklist[]> {
	const { data, error } = await supabase
		.from('task_checklists')
		.select('*')
		.eq('task_id', taskId)
		.order('position', { ascending: true });
	if (error) throw error;
	return data.map(parseChecklistRecord);
}

async function fillItems(supabase: SupabaseClient, checklists: TaskChecklist[]): Promise<void> {
	const checklistIds = checklists.map((checklist) => checklist.id);
	const { data, error } = await supabase
		.from('task_checklist_items')
		.select('*')
		.in('checklist_id', checklistIds)
		.order('position', { ascending: true });
	if (error) throw error;
	const checklistById = new Map(checklists.map((checklist) => [checklist.id, checklist]));
	for (const row of data) {
		const item = parseChecklistItemRecord(row);
		checklistById.get(item.checklistId)?.items.push(item);
	}
}
