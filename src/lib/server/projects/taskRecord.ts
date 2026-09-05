import { parseBuildStatus, type BuildStatus } from '$lib/data/buildStatus';
import { parseStoryPoints } from '$lib/data/storyPoints';
import { parseTaskStatus, type TaskStatus } from '$lib/data/taskStatus';

export type ProjectTask = {
	id: string;
	projectId: string;
	parentTaskId: string | null;
	phaseId: string | null;
	title: string;
	details: string;
	status: TaskStatus;
	priority: number;
	globalPriority: number | null;
	storyPoints: number;
	completionPercent: number;
	isUserStory: boolean;
	storyRole: string;
	storyWant: string;
	storyBenefit: string;
	dueDate: string | null;
	buildBrief: string;
	buildStatus: BuildStatus;
	pullRequestUrl: string;
	buildSessionUrl: string;
	hasMigration: boolean;
	createdAt: string;
};

export function parseTaskRecord(row: Record<string, unknown>): ProjectTask {
	return {
		id: row.id as string,
		projectId: row.project_id as string,
		parentTaskId: (row.parent_task_id as string) ?? null,
		phaseId: (row.phase_id as string) ?? null,
		title: row.title as string,
		details: row.details as string,
		status: parseTaskStatus(row.status),
		priority: row.priority as number,
		globalPriority: (row.global_priority as number) ?? null,
		storyPoints: parseStoryPoints(row.story_points),
		completionPercent: row.completion_percent as number,
		isUserStory: row.is_user_story as boolean,
		storyRole: row.story_role as string,
		storyWant: row.story_want as string,
		storyBenefit: row.story_benefit as string,
		dueDate: (row.due_date as string) ?? null,
		buildBrief: (row.build_brief as string) ?? '',
		buildStatus: parseBuildStatus(row.build_status),
		pullRequestUrl: (row.pull_request_url as string) ?? '',
		buildSessionUrl: (row.build_session_url as string) ?? '',
		hasMigration: row.has_migration === true,
		createdAt: row.created_at as string
	};
}
