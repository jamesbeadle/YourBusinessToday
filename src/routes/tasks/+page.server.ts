import { fail } from '@sveltejs/kit';
import { getBuildsWaitingOnMe, singlePageOf } from '$lib/server/builder/getBuildsWaitingOnMe';
import { getGlobalTaskPage } from '$lib/server/projects/getGlobalTaskPage';
import { getStaffDirectory } from '$lib/server/projects/getStaffDirectory';
import { moveGlobalTask } from '$lib/server/projects/moveGlobalTask';
import { parseDropPlacement } from '$lib/server/projects/dropReorder';
import { parseTaskStatus } from '$lib/data/taskStatus';
import { placeGlobalTask } from '$lib/server/projects/placeGlobalTask';
import { requireStaff } from '$lib/server/auth/requireStaff';
import { resolveViewedStaffMember } from '$lib/server/projects/resolveViewedStaffMember';
import { updateTaskStatus } from '$lib/server/projects/updateTaskStatus';
import type { TaskMoveDirection } from '$lib/server/projects/moveTask';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const user = await requireStaff(locals);
	const pageNumber = readPageNumber(url.searchParams.get('page'));
	const shouldIncludeDone = url.searchParams.get('status') === 'all';
	const isWaitingOnMe = url.searchParams.get('status') === 'waiting';
	const staffMembers = await getStaffDirectory(locals.supabase);
	const viewedStaffMember = resolveViewedStaffMember(
		url.searchParams.get('user'),
		staffMembers,
		user.id
	);
	const taskPage = isWaitingOnMe
		? singlePageOf(await getBuildsWaitingOnMe(locals.supabase, viewedStaffMember.id))
		: await getGlobalTaskPage(locals.supabase, viewedStaffMember.id, pageNumber, shouldIncludeDone);
	return {
		taskPage,
		shouldIncludeDone,
		isWaitingOnMe,
		staffMembers,
		viewedStaffMember,
		currentUserId: user.id
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
	placeTask: async ({ locals, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const movedTaskId = String(formData.get('movedTaskId') ?? '');
		const targetTaskId = String(formData.get('targetTaskId') ?? '');
		if (movedTaskId === '' || targetTaskId === '') {
			return fail(400, { message: 'A task to move and a drop target are required.' });
		}
		const placement = parseDropPlacement(formData.get('placement'));
		await placeGlobalTask(locals.supabase, movedTaskId, targetTaskId, placement);
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
