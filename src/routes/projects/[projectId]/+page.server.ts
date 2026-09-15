import { buildTaskTree } from '$lib/server/projects/buildTaskTree';
import { getGoalSummaries } from '$lib/server/goals/getGoalSummaries';
import { getProjectGoals } from '$lib/server/goals/getProjectGoals';
import { getProjectPeople } from '$lib/server/members/getProjectPeople';
import { getProjectTasks } from '$lib/server/projects/getProjectTasks';
import { getTaskAssigneeMap } from '$lib/server/projects/getTaskAssigneeMap';
import { goalActions } from './goalActions';
import { memberActions } from './memberActions';
import { projectActions } from './projectActions';
import { requireProjectAccess } from '$lib/server/auth/requireProjectAccess';
import { taskActions } from './taskActions';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { project, isOwner } = await requireProjectAccess(locals, params.projectId);
	const tasks = await getProjectTasks(locals.supabase, project.id);
	const goals = await getProjectGoals(locals.supabase, project.id);
	const taskIds = tasks.map((task) => task.id);
	const assigneeIdsByTask = await getTaskAssigneeMap(locals.supabase, taskIds);
	return {
		project,
		isOwner,
		taskTree: buildTaskTree(tasks),
		goalSummaries: getGoalSummaries(goals, tasks),
		goals,
		people: await getProjectPeople(locals.supabase, project.id),
		assigneeIdsByTask: Object.fromEntries(assigneeIdsByTask)
	};
};

export const actions = {
	...projectActions,
	...goalActions,
	...memberActions,
	...taskActions
} satisfies Actions;
