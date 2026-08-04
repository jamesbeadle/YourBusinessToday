import { error, fail } from '@sveltejs/kit';
import { getProject } from '$lib/server/projects/getProject';
import { getProjectPhases } from '$lib/server/projects/getProjectPhases';
import { getProjectSprints } from '$lib/server/projects/getProjectSprints';
import { getProjectTasks } from '$lib/server/projects/getProjectTasks';
import { parseTaskStatus } from '$lib/data/taskStatus';
import { requireStaff } from '$lib/server/auth/requireStaff';
import { updateTaskStatus } from '$lib/server/projects/updateTaskStatus';
import { weightedCompletionPercent } from '$lib/data/completionSummary';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	await requireStaff(locals);
	const project = await getProject(locals.supabase, params.projectId);
	if (project === null) error(404, 'Project not found');
	const sprints = await getProjectSprints(locals.supabase, params.projectId);
	const sprint = sprints.find((candidate) => candidate.id === params.sprintId);
	if (sprint === undefined) error(404, 'Sprint not found');
	const projectTasks = await getProjectTasks(locals.supabase, params.projectId);
	const sprintTasks = projectTasks.filter((task) => task.sprintId === sprint.id);
	return {
		project,
		sprint,
		tasks: sprintTasks,
		phases: await getProjectPhases(locals.supabase, params.projectId),
		completionPercent: weightedCompletionPercent(sprintTasks)
	};
};

export const actions: Actions = {
	setStatus: async ({ locals, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const taskId = String(formData.get('taskId') ?? '');
		if (taskId === '') return fail(400, { message: 'A task is required.' });
		await updateTaskStatus(locals.supabase, taskId, parseTaskStatus(formData.get('status')));
		return {};
	}
};
