import type { SupabaseClient } from '@supabase/supabase-js';
import { getProject } from '$lib/server/projects/getProject';
import { getProjectPhases } from '$lib/server/projects/getProjectPhases';
import { getStaffDirectory } from '$lib/server/projects/getStaffDirectory';
import { getTask } from '$lib/server/projects/getTask';
import { getTaskAcceptanceCriteria } from '$lib/server/projects/getTaskAcceptanceCriteria';
import { getTaskAssigneeMap } from '$lib/server/projects/getTaskAssigneeMap';
import { getTaskChecklists } from '$lib/server/projects/getTaskChecklists';
import { getTaskComments } from '$lib/server/projects/getTaskComments';
import { getTaskRoles } from '$lib/server/projects/getTaskRoles';

export async function loadTaskWorkspace(
	supabase: SupabaseClient,
	projectId: string,
	taskId: string
) {
	const [task, project] = await Promise.all([
		getTask(supabase, taskId),
		getProject(supabase, projectId)
	]);
	if (task === null || project === null) return null;
	const [staffMembers, phases, comments, criteria, checklists, assigneeIdsByTask, roles] =
		await Promise.all([
			getStaffDirectory(supabase),
			getProjectPhases(supabase, projectId),
			getTaskComments(supabase, taskId),
			getTaskAcceptanceCriteria(supabase, taskId),
			getTaskChecklists(supabase, taskId),
			getTaskAssigneeMap(supabase, [taskId]),
			getTaskRoles(supabase, taskId)
		]);
	return {
		task,
		project,
		staffMembers,
		phases,
		comments,
		criteria,
		checklists,
		assigneeIds: assigneeIdsByTask.get(taskId) ?? [],
		roles
	};
}
