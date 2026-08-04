import { error, fail, redirect } from '@sveltejs/kit';
import { addAcceptanceCriterion } from '$lib/server/projects/addAcceptanceCriterion';
import { addTaskComment } from '$lib/server/projects/addTaskComment';
import { deleteAcceptanceCriterion } from '$lib/server/projects/deleteAcceptanceCriterion';
import { deleteTask } from '$lib/server/projects/deleteTask';
import { loadTaskWorkspace } from '$lib/server/projects/loadTaskWorkspace';
import { parseTaskDetailsForm } from '$lib/server/projects/parseTaskDetailsForm';
import { requireStaff } from '$lib/server/auth/requireStaff';
import { setCriterionMet } from '$lib/server/projects/setCriterionMet';
import { setTaskAssignees } from '$lib/server/projects/setTaskAssignees';
import { setTaskRoles } from '$lib/server/projects/setTaskRoles';
import { updateTaskDetails } from '$lib/server/projects/updateTaskDetails';
import type { StaffMember } from '$lib/server/projects/getStaffDirectory';
import type { TaskComment } from '$lib/server/projects/getTaskComments';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	await requireStaff(locals);
	const workspace = await loadTaskWorkspace(locals.supabase, params.projectId, params.taskId);
	if (workspace === null) error(404, 'Task not found');
	return {
		...workspace,
		comments: withAuthorNames(workspace.comments, workspace.staffMembers)
	};
};

export const actions: Actions = {
	saveTask: async ({ locals, params, request }) => {
		await requireStaff(locals);
		const submission = parseTaskDetailsForm(await request.formData());
		if (submission === null) return fail(400, { message: 'A task title is required.' });
		await updateTaskDetails(locals.supabase, params.taskId, submission);
		await setTaskAssignees(locals.supabase, params.taskId, submission.assigneeIds);
		await setTaskRoles(locals.supabase, params.taskId, submission.roles);
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
	addCriterion: async ({ locals, params, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const description = String(formData.get('description') ?? '').trim();
		if (description === '') return fail(400, { message: 'A criterion needs a description.' });
		await addAcceptanceCriterion(locals.supabase, params.taskId, description);
		return {};
	},
	setCriterionMet: async ({ locals, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const criterionId = String(formData.get('criterionId') ?? '');
		if (criterionId === '') return fail(400, { message: 'A criterion is required.' });
		await setCriterionMet(locals.supabase, criterionId, formData.get('isMet') === 'true');
		return {};
	},
	deleteCriterion: async ({ locals, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const criterionId = String(formData.get('criterionId') ?? '');
		if (criterionId === '') return fail(400, { message: 'A criterion is required.' });
		await deleteAcceptanceCriterion(locals.supabase, criterionId);
		return {};
	},
	deleteTask: async ({ locals, params }) => {
		await requireStaff(locals);
		await deleteTask(locals.supabase, params.taskId);
		redirect(303, `/projects/${params.projectId}`);
	}
};

function withAuthorNames(comments: TaskComment[], staffMembers: StaffMember[]) {
	const nameById = new Map(staffMembers.map((staffMember) => [staffMember.id, staffMember.name]));
	return comments.map((comment) => ({
		...comment,
		authorName: nameById.get(comment.authorId) ?? 'Former staff'
	}));
}
