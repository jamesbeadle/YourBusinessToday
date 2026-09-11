import { error } from '@sveltejs/kit';
import { buildTaskTree } from '$lib/server/projects/buildTaskTree';
import { getGoalSummaries } from '$lib/server/goals/getGoalSummaries';
import { getPhaseSummaries } from '$lib/server/projects/getPhaseSummaries';
import { getProfileFlags } from '$lib/server/auth/getProfileFlags';
import { getProject } from '$lib/server/projects/getProject';
import { getProjectGoals } from '$lib/server/goals/getProjectGoals';
import { getProjectMembers } from '$lib/server/members/getProjectMembers';
import { getProjectPhases } from '$lib/server/projects/getProjectPhases';
import { getProjectTasks } from '$lib/server/projects/getProjectTasks';
import { getStaffDirectory } from '$lib/server/projects/getStaffDirectory';
import { getTaskAssigneeMap } from '$lib/server/projects/getTaskAssigneeMap';
import { goalActions } from './goalActions';
import { memberActions } from './memberActions';
import { projectActions } from './projectActions';
import { requireStaff } from '$lib/server/auth/requireStaff';
import { taskActions } from './taskActions';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	await requireStaff(locals);
	const project = await getProject(locals.supabase, params.projectId);
	if (project === null) error(404, 'Project not found');
	const tasks = await getProjectTasks(locals.supabase, params.projectId);
	const phases = await getProjectPhases(locals.supabase, params.projectId);
	const goals = await getProjectGoals(locals.supabase, params.projectId);
	const taskIds = tasks.map((task) => task.id);
	const assigneeIdsByTask = await getTaskAssigneeMap(locals.supabase, taskIds);
	const isAdmin = (await getProfileFlags(locals.supabase)).isAdmin;
	return {
		project,
		taskTree: buildTaskTree(tasks),
		phaseSummaries: getPhaseSummaries(phases, tasks),
		goalSummaries: getGoalSummaries(goals, tasks),
		goals,
		members: isAdmin ? await getProjectMembers(locals.supabase, params.projectId) : null,
		staffMembers: await getStaffDirectory(locals.supabase),
		assigneeIdsByTask: Object.fromEntries(assigneeIdsByTask)
	};
};

export const actions = {
	...projectActions,
	...goalActions,
	...memberActions,
	...taskActions
} satisfies Actions;
