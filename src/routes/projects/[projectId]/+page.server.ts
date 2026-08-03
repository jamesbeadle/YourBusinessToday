import { error, fail } from '@sveltejs/kit';
import { createTask } from '$lib/server/projects/createTask';
import { getProject } from '$lib/server/projects/getProject';
import { getProjectTasks } from '$lib/server/projects/getProjectTasks';
import { getStaffDirectory } from '$lib/server/projects/getStaffDirectory';
import { moveTask, type TaskMoveDirection } from '$lib/server/projects/moveTask';
import { parseTaskStatus } from '$lib/data/taskStatus';
import { requireStaff } from '$lib/server/auth/requireStaff';
import { updateTaskStatus } from '$lib/server/projects/updateTaskStatus';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	await requireStaff(locals);
	const project = await getProject(locals.supabase, params.projectId);
	if (project === null) error(404, 'Project not found');
	return {
		project,
		tasks: await getProjectTasks(locals.supabase, params.projectId),
		staffMembers: await getStaffDirectory(locals.supabase)
	};
};

export const actions: Actions = {
	createTask: async ({ locals, params, request }) => {
		const user = await requireStaff(locals);
		const formData = await request.formData();
		const title = String(formData.get('title') ?? '').trim();
		if (title === '') return fail(400, { message: 'A task title is required.' });
		await createTask(locals.supabase, params.projectId, title, user.id);
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
	setStatus: async ({ locals, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const taskId = String(formData.get('taskId') ?? '');
		if (taskId === '') return fail(400, { message: 'A task is required.' });
		await updateTaskStatus(locals.supabase, taskId, parseTaskStatus(formData.get('status')));
		return {};
	}
};
