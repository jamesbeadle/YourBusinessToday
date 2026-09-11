import { fail } from '@sveltejs/kit';
import { createTask, readNewTaskSeed } from '$lib/server/projects/createTask';
import { getTask } from '$lib/server/projects/getTask';
import { moveTask, type TaskMoveDirection } from '$lib/server/projects/moveTask';
import { parseDropPlacement } from '$lib/server/projects/dropReorder';
import { parseTaskStatus } from '$lib/data/taskStatus';
import { placeTask } from '$lib/server/projects/placeTask';
import { requireStaff } from '$lib/server/auth/requireStaff';
import { statusChangeRefusal } from '$lib/server/support/statusChangeRefusal';
import { updateTaskStatus } from '$lib/server/projects/updateTaskStatus';
import type { Actions } from './$types';

export const taskActions = {
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
		const task = await getTask(locals.supabase, String(formData.get('taskId') ?? ''));
		if (task === null) return fail(400, { message: 'A task is required.' });
		const status = parseTaskStatus(formData.get('status'));
		const refusal = statusChangeRefusal(task, status);
		if (refusal !== null) return fail(400, { message: refusal });
		await updateTaskStatus(locals.supabase, task.id, status);
		return {};
	}
} satisfies Actions;
