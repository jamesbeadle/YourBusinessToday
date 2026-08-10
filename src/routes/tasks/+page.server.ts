import { fail } from '@sveltejs/kit';
import { getGlobalTaskPage } from '$lib/server/projects/getGlobalTaskPage';
import { moveGlobalTask } from '$lib/server/projects/moveGlobalTask';
import { parseTaskStatus } from '$lib/data/taskStatus';
import { requireStaff } from '$lib/server/auth/requireStaff';
import { updateTaskStatus } from '$lib/server/projects/updateTaskStatus';
import type { TaskMoveDirection } from '$lib/server/projects/moveTask';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	await requireStaff(locals);
	const pageNumber = readPageNumber(url.searchParams.get('page'));
	const shouldIncludeDone = url.searchParams.get('status') === 'all';
	return {
		taskPage: await getGlobalTaskPage(locals.supabase, pageNumber, shouldIncludeDone),
		shouldIncludeDone
	};
};

export const actions: Actions = {
	moveTask: async ({ locals, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const taskId = String(formData.get('taskId') ?? '');
		const direction = String(formData.get('direction')) as TaskMoveDirection;
		const shouldIncludeDone = String(formData.get('includeDone')) === 'true';
		if (taskId === '') return fail(400, { message: 'A task is required.' });
		await moveGlobalTask(locals.supabase, taskId, direction, shouldIncludeDone);
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

function readPageNumber(value: string | null): number {
	const parsed = Number(value);
	if (!Number.isInteger(parsed) || parsed < 1) return 1;
	return parsed;
}
