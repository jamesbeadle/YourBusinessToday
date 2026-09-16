import { fail } from '@sveltejs/kit';
import { applyTaskMoveChoice, parseTaskMoveChoice } from '$lib/server/projects/taskMoveChoice';
import { getTask } from '$lib/server/projects/getTask';
import { parseRank } from '$lib/server/ordering/rankInput';
import { parseTaskDetailsForm } from '$lib/server/projects/parseTaskDetailsForm';
import { requireProjectAccess } from '$lib/server/auth/requireProjectAccess';
import { setTaskAssignees } from '$lib/server/projects/setTaskAssignees';
import { setTaskPriority } from '$lib/server/projects/setTaskPriority';
import { setTaskRoles } from '$lib/server/projects/setTaskRoles';
import { statusChangeRefusal } from '$lib/server/support/statusChangeRefusal';
import { updateTaskDetails } from '$lib/server/projects/updateTaskDetails';
import type { Actions } from './$types';

export const saveTaskActions: Actions = {
	saveTask: async ({ locals, params, request }) => {
		await requireProjectAccess(locals, params.projectId);
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
		const priority = parseRank(formData.get('priority'));
		if (priority !== null && priority !== task.priority) {
			await setTaskPriority(locals.supabase, params.taskId, priority);
		}
		return { message: 'Task saved.' };
	}
};
