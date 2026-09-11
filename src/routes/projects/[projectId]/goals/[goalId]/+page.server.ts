import { error, fail, redirect } from '@sveltejs/kit';
import { deleteGoal } from '$lib/server/goals/deleteGoal';
import { findTasks } from '$lib/server/support/findTasks';
import { getAccountDirectory } from '$lib/server/accounts/getAccountDirectory';
import { getGoal } from '$lib/server/goals/getGoal';
import { getProject } from '$lib/server/projects/getProject';
import { getThread } from '$lib/server/conversations/getThread';
import { messageFormRefusal, readMessageForm } from '$lib/server/conversations/readMessageForm';
import { postMessage } from '$lib/server/conversations/postMessage';
import { readGoalUpdate, updateGoal } from '$lib/server/goals/updateGoal';
import { requireStaff } from '$lib/server/auth/requireStaff';
import { withAuthorNames } from '$lib/server/conversations/withAuthorNames';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	await requireStaff(locals);
	const [goal, project] = await Promise.all([
		getGoal(locals.supabase, params.goalId),
		getProject(locals.supabase, params.projectId)
	]);
	if (goal === null || project === null || goal.projectId !== project.id) error(404, 'Goal not found');
	const [tasks, messages] = await Promise.all([
		findTasks(locals.supabase, { projectId: project.id, goalId: goal.id, phrase: '' }),
		getThread(locals.supabase, { goalId: goal.id }, true)
	]);
	const authorIds = messages.map((message) => message.authorAccountId);
	const accounts = await getAccountDirectory(locals.supabase, authorIds);
	return { goal, project, tasks, messages: withAuthorNames(messages, accounts) };
};

export const actions: Actions = {
	saveGoal: async ({ locals, params, request }) => {
		await requireStaff(locals);
		const update = readGoalUpdate(await request.formData());
		if (update === null) return fail(400, { message: 'A goal needs a title.' });
		await updateGoal(locals.supabase, params.goalId, update);
		return { message: 'Goal saved.' };
	},
	postMessage: async ({ locals, params, request }) => {
		const user = await requireStaff(locals);
		const submission = readMessageForm(await request.formData());
		if (submission === null) return fail(400, { message: messageFormRefusal });
		await postMessage(locals.supabase, { goalId: params.goalId }, user.id, submission.body, submission.isInternal);
		return {};
	},
	deleteGoal: async ({ locals, params }) => {
		await requireStaff(locals);
		await deleteGoal(locals.supabase, params.goalId);
		redirect(303, `/projects/${params.projectId}`);
	}
};
