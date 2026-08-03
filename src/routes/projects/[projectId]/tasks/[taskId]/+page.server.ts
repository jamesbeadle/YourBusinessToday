import { error, fail, redirect } from '@sveltejs/kit';
import { addTaskComment } from '$lib/server/projects/addTaskComment';
import { deleteTask } from '$lib/server/projects/deleteTask';
import { getProject } from '$lib/server/projects/getProject';
import { getStaffDirectory, type StaffMember } from '$lib/server/projects/getStaffDirectory';
import { getTask } from '$lib/server/projects/getTask';
import { getTaskComments, type TaskComment } from '$lib/server/projects/getTaskComments';
import { parseTaskStatus } from '$lib/data/taskStatus';
import { requireStaff } from '$lib/server/auth/requireStaff';
import { updateTaskDetails } from '$lib/server/projects/updateTaskDetails';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	await requireStaff(locals);
	const task = await getTask(locals.supabase, params.taskId);
	if (task === null) error(404, 'Task not found');
	const project = await getProject(locals.supabase, params.projectId);
	if (project === null) error(404, 'Project not found');
	const staffMembers = await getStaffDirectory(locals.supabase);
	const comments = await getTaskComments(locals.supabase, params.taskId);
	return { task, project, staffMembers, comments: withAuthorNames(comments, staffMembers) };
};

export const actions: Actions = {
	saveTask: async ({ locals, params, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const title = String(formData.get('title') ?? '').trim();
		if (title === '') return fail(400, { message: 'A task title is required.' });
		await updateTaskDetails(locals.supabase, params.taskId, {
			title,
			details: String(formData.get('details') ?? '').trim(),
			status: parseTaskStatus(formData.get('status')),
			dueDate: emptyAsNull(String(formData.get('dueDate') ?? '')),
			assigneeId: emptyAsNull(String(formData.get('assigneeId') ?? ''))
		});
		return { message: 'Task saved.' };
	},
	addComment: async ({ locals, params, request }) => {
		const user = await requireStaff(locals);
		const formData = await request.formData();
		const body = String(formData.get('body') ?? '').trim();
		if (body === '') return fail(400, { message: 'A comment needs some text.' });
		await addTaskComment(locals.supabase, params.taskId, user.id, body);
		return {};
	},
	deleteTask: async ({ locals, params }) => {
		await requireStaff(locals);
		await deleteTask(locals.supabase, params.taskId);
		redirect(303, `/projects/${params.projectId}`);
	}
};

function emptyAsNull(value: string): string | null {
	if (value === '') return null;
	return value;
}

function withAuthorNames(comments: TaskComment[], staffMembers: StaffMember[]) {
	const nameById = new Map(staffMembers.map((staffMember) => [staffMember.id, staffMember.name]));
	return comments.map((comment) => ({
		...comment,
		authorName: nameById.get(comment.authorId) ?? 'Former staff'
	}));
}
