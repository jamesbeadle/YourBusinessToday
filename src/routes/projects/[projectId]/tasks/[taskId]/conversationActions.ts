import { fail } from '@sveltejs/kit';
import { getProject } from '$lib/server/projects/getProject';
import { getTask } from '$lib/server/projects/getTask';
import { longestMessageBody, postMessage } from '$lib/server/conversations/postMessage';
import { messageFormRefusal, readMessageForm } from '$lib/server/conversations/readMessageForm';
import { requireStaff } from '$lib/server/auth/requireStaff';
import { resolveSupportTask } from '$lib/server/support/resolveSupportTask';
import type { Actions } from './$types';

export const conversationActions = {
	postMessage: async ({ locals, params, request }) => {
		const user = await requireStaff(locals);
		const submission = readMessageForm(await request.formData());
		if (submission === null) return fail(400, { message: messageFormRefusal });
		await postMessage(
			locals.supabase,
			{ taskId: params.taskId },
			user.id,
			submission.body,
			submission.isInternal
		);
		return {};
	},
	resolve: async ({ locals, params, request }) => {
		const user = await requireStaff(locals);
		const resolution = String((await request.formData()).get('resolution') ?? '').trim();
		if (resolution === '' || resolution.length > longestMessageBody) {
			return fail(400, { message: `The resolution needs some words, fewer than ${longestMessageBody}.` });
		}
		const [task, project] = await Promise.all([
			getTask(locals.supabase, params.taskId),
			getProject(locals.supabase, params.projectId)
		]);
		if (task === null || project === null || task.kind !== 'support') {
			return fail(400, { message: 'Only a support task is resolved this way.' });
		}
		await resolveSupportTask(locals.supabase, task, project, resolution, user.id);
		return { message: 'Resolved, with your answer posted for them to read.' };
	}
} satisfies Actions;
