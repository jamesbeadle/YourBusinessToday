import type { SupabaseClient } from '@supabase/supabase-js';
import { getAccountDirectory } from '$lib/server/accounts/getAccountDirectory';
import { getProject } from '$lib/server/projects/getProject';
import { getProjectGoals } from '$lib/server/goals/getProjectGoals';
import { getProjectPhases } from '$lib/server/projects/getProjectPhases';
import { getStaffDirectory } from '$lib/server/projects/getStaffDirectory';
import { getTask } from '$lib/server/projects/getTask';
import { getTaskAcceptanceCriteria } from '$lib/server/projects/getTaskAcceptanceCriteria';
import { getTaskAttachments } from '$lib/server/projects/getTaskAttachments';
import { getTaskAssigneeMap } from '$lib/server/projects/getTaskAssigneeMap';
import { getTaskChecklists } from '$lib/server/projects/getTaskChecklists';
import { getTaskRoles } from '$lib/server/projects/getTaskRoles';
import { getThread } from '$lib/server/conversations/getThread';

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
	const [
		staffMembers,
		phases,
		goals,
		messages,
		criteria,
		checklists,
		attachments,
		assigneeIdsByTask,
		roles
	] = await Promise.all([
		getStaffDirectory(supabase),
		getProjectPhases(supabase, projectId),
		getProjectGoals(supabase, projectId),
		getThread(supabase, { taskId }, true),
		getTaskAcceptanceCriteria(supabase, taskId),
		getTaskChecklists(supabase, taskId),
		getTaskAttachments(supabase, taskId),
		getTaskAssigneeMap(supabase, [taskId]),
		getTaskRoles(supabase, taskId)
	]);
	const authorIds = [task.createdBy, ...messages.map((message) => message.authorAccountId)];
	return {
		task,
		project,
		staffMembers,
		phases,
		goals,
		messages,
		accounts: await getAccountDirectory(supabase, authorIds),
		criteria,
		checklists,
		attachments,
		assigneeIds: assigneeIdsByTask.get(taskId) ?? [],
		roles
	};
}
