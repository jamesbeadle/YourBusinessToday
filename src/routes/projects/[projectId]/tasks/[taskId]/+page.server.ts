import { error, fail, redirect } from '@sveltejs/kit';
import { addAcceptanceCriterion } from '$lib/server/projects/addAcceptanceCriterion';
import { accountNameLookup } from '$lib/data/accountNames';
import { attachmentActions } from './attachmentActions';
import { buildActions } from './buildActions';
import { checklistActions } from './checklistActions';
import { conversationActions } from './conversationActions';
import { createTask, readNewTaskSeed } from '$lib/server/projects/createTask';
import { deleteAcceptanceCriterion } from '$lib/server/projects/deleteAcceptanceCriterion';
import { deleteTask } from '$lib/server/projects/deleteTask';
import { getTask } from '$lib/server/projects/getTask';
import { getTaskFamily } from '$lib/server/projects/getTaskFamily';
import { applyTaskMoveChoice, parseTaskMoveChoice } from '$lib/server/projects/taskMoveChoice';
import { loadTaskWorkspace } from '$lib/server/projects/loadTaskWorkspace';
import { parseTaskDetailsForm } from '$lib/server/projects/parseTaskDetailsForm';
import { requireStaff } from '$lib/server/auth/requireStaff';
import { setCriterionMet } from '$lib/server/projects/setCriterionMet';
import { setTaskAssignees } from '$lib/server/projects/setTaskAssignees';
import { setTaskRoles } from '$lib/server/projects/setTaskRoles';
import { updateTaskDetails } from '$lib/server/projects/updateTaskDetails';
import { statusChangeRefusal } from '$lib/server/support/statusChangeRefusal';
import { withAuthorNames } from '$lib/server/conversations/withAuthorNames';
import { withUploaderNames } from '$lib/server/projects/staffNames';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	await requireStaff(locals);
	const workspace = await loadTaskWorkspace(locals.supabase, params.projectId, params.taskId);
	if (workspace === null) error(404, 'Task not found');
	return {
		...workspace,
		...(await getTaskFamily(locals.supabase, workspace.task)),
		messages: withAuthorNames(workspace.messages, workspace.accounts),
		raisedByName: accountNameLookup(workspace.accounts)(workspace.task.createdBy),
		attachments: withUploaderNames(workspace.attachments, workspace.staffMembers)
	};
};

export const actions: Actions = {
	...checklistActions,
	...buildActions,
	...attachmentActions,
	...conversationActions,
	saveTask: async ({ locals, params, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const submission = parseTaskDetailsForm(formData);
		if (submission === null) return fail(400, { message: 'A task title is required.' });
		const task = await getTask(locals.supabase, params.taskId);
		if (task === null) return fail(404, { message: 'Task not found.' });
		const refusal = statusChangeRefusal(task, submission.status);
		if (refusal !== null) return fail(400, { message: refusal });
		await updateTaskDetails(locals.supabase, params.taskId, submission);
		await setTaskAssignees(locals.supabase, params.taskId, submission.assigneeIds);
		await setTaskRoles(locals.supabase, params.taskId, submission.roles);
		const moveChoice = parseTaskMoveChoice(formData.get('moveTo'));
		await applyTaskMoveChoice(locals.supabase, params.taskId, moveChoice);
		return { message: 'Task saved.' };
	},
	addSubtask: async ({ locals, params, request }) => {
		const user = await requireStaff(locals);
		const seed = readNewTaskSeed(await request.formData());
		if (seed === null) return fail(400, { message: 'A subtask title is required.' });
		await createTask(locals.supabase, params.projectId, seed, user.id);
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
