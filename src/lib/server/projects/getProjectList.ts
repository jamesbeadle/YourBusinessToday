import type { SupabaseClient } from '@supabase/supabase-js';
import { parseStoryPoints } from '$lib/data/storyPoints';
import { parseTaskStatus, type TaskStatus } from '$lib/data/taskStatus';
import { weightedCompletionPercent, type CompletionInput } from '$lib/data/completionSummary';
import { parseProjectRecord, type Project } from '$lib/server/projects/projectRecord';

export type ProjectProgress = {
	openTaskCount: number;
	taskCount: number;
	completionPercent: number;
};

export type ProjectSummary = Project & ProjectProgress;

type TaskProgress = CompletionInput & { isDone: boolean };

const doneTaskStatus: TaskStatus = 'done';

export async function getProjectList(
	supabase: SupabaseClient,
	ownerId: string
): Promise<ProjectSummary[]> {
	const { data, error } = await supabase
		.from('projects')
		.select('*, tasks(status, story_points, completion_percent)')
		.eq('owner_id', ownerId)
		.order('priority', { ascending: true });
	if (error) throw error;
	return data.map((row: Record<string, unknown>) => ({
		...parseProjectRecord(row),
		...summariseProgress(row.tasks as Record<string, unknown>[])
	}));
}

function summariseProgress(taskRows: Record<string, unknown>[]): ProjectProgress {
	const tasks = taskRows.map(readTaskProgress);
	return {
		openTaskCount: tasks.filter((task) => !task.isDone).length,
		taskCount: tasks.length,
		completionPercent: weightedCompletionPercent(tasks)
	};
}

function readTaskProgress(row: Record<string, unknown>): TaskProgress {
	return {
		isDone: parseTaskStatus(row.status) === doneTaskStatus,
		storyPoints: parseStoryPoints(row.story_points),
		completionPercent: Number(row.completion_percent ?? 0)
	};
}
