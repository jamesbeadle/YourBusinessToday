import { error, fail } from '@sveltejs/kit';
import { buildTaskTree } from '$lib/server/projects/buildTaskTree';
import { createTask, readNewTaskSeed } from '$lib/server/projects/createTask';
import { getPhaseSummaries } from '$lib/server/projects/getPhaseSummaries';
import { getProject } from '$lib/server/projects/getProject';
import { getProjectPhases } from '$lib/server/projects/getProjectPhases';
import { getProjectTasks } from '$lib/server/projects/getProjectTasks';
import { getStaffDirectory } from '$lib/server/projects/getStaffDirectory';
import { getTaskAssigneeMap } from '$lib/server/projects/getTaskAssigneeMap';
import { moveTask, type TaskMoveDirection } from '$lib/server/projects/moveTask';
import { parseDropPlacement } from '$lib/server/projects/dropReorder';
import { parseTaskStatus } from '$lib/data/taskStatus';
import { placeTask } from '$lib/server/projects/placeTask';
import { projectActions } from './projectActions';
import { requireStaff } from '$lib/server/auth/requireStaff';
import { updateTaskPhase } from '$lib/server/projects/updateTaskPhase';
import { updateTaskStatus } from '$lib/server/projects/updateTaskStatus';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	await requireStaff(locals);
	const project = await getProject(locals.supabase, params.projectId);
	if (project === null) error(404, 'Project not found');
	const tasks = await getProjectTasks(locals.supabase, params.projectId);
	const phases = await getProjectPhases(locals.supabase, params.projectId);
	const taskIds = tasks.map((task) => task.id);
	const assigneeIdsByTask = await getTaskAssigneeMap(locals.supabase, taskIds);
	return {
		project,
		taskTree: buildTaskTree(tasks),
		phaseSummaries: getPhaseSummaries(phases, tasks),
		staffMembers: await getStaffDirectory(locals.supabase),
		assigneeIdsByTask: Object.fromEntries(assigneeIdsByTask)
	};
};

export const actions: Actions = {
	...projectActions,
	createTask: async ({ locals, params, request }) => {
		const user = await requireStaff(locals);
		const seed = readNewTaskSeed(await request.formData());
		if (seed === null) return fail(400, { message: 'A task title is required.' });
		await createTask(locals.supabase, params.projectId, seed, user.id);
		return {};
	},
	moveTask: async ({ locals, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const taskId = String(formData.get('taskId') ?? '');
		const direction = String(formData.get('direction')) as TaskMoveDirection;
		if (taskId === '') return fail(400, { message: 'A task is required.' });
		await moveTask(locals.supabase, taskId, direction);
		return {};
	},
	placeTask: async ({ locals, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const movedTaskId = String(formData.get('movedTaskId') ?? '');
		const targetTaskId = String(formData.get('targetTaskId') ?? '');
		if (movedTaskId === '' || targetTaskId === '') {
			return fail(400, { message: 'A task to move and a drop target are required.' });
		}
		const placement = parseDropPlacement(formData.get('placement'));
		await placeTask(locals.supabase, movedTaskId, targetTaskId, placement);
		return {};
	},
	setStatus: async ({ locals, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const taskId = String(formData.get('taskId') ?? '');
		if (taskId === '') return fail(400, { message: 'A task is required.' });
		await updateTaskStatus(locals.supabase, taskId, parseTaskStatus(formData.get('status')));
		return {};
	},
	setPhase: async ({ locals, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const taskId = String(formData.get('taskId') ?? '');
		if (taskId === '') return fail(400, { message: 'A task is required.' });
		const phaseId = String(formData.get('phaseId') ?? '');
		await updateTaskPhase(locals.supabase, taskId, phaseId === '' ? null : phaseId);
		return {};
	}
};
