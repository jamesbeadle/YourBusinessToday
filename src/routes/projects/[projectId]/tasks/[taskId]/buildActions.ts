import { fail } from '@sveltejs/kit';
import { getProject } from '$lib/server/projects/getProject';
import { getTask } from '$lib/server/projects/getTask';
import { requireStaff } from '$lib/server/auth/requireStaff';
import { reviseBuildBrief } from '$lib/server/builder/reviseBuildBrief';
import { sendTaskToBuild } from '$lib/server/builder/sendTaskToBuild';
import type { Actions } from './$types';

const briefRevisionSentences = {
	saved: 'Brief saved.',
	empty: 'Write the brief first.',
	building: 'The brief is locked while a build is running.'
};

export const buildActions: Actions = {
	saveBrief: async ({ locals, params, request }) => {
		await requireStaff(locals);
		const task = await getTask(locals.supabase, params.taskId);
		if (task === null) return fail(404, { message: 'Task not found.' });
		const brief = String((await request.formData()).get('brief') ?? '');
		const revision = await reviseBuildBrief(locals.supabase, task, brief);
		if (revision !== 'saved') return fail(400, { message: briefRevisionSentences[revision] });
		return { message: briefRevisionSentences.saved };
	},
	sendToBuild: async ({ locals, params, request }) => {
		const user = await requireStaff(locals);
		const task = await getTask(locals.supabase, params.taskId);
		const project = await getProject(locals.supabase, params.projectId);
		if (task === null || project === null) return fail(404, { message: 'Task not found.' });
		const brief = String((await request.formData()).get('brief') ?? '');
		const revision = await reviseBuildBrief(locals.supabase, task, brief);
		if (revision !== 'saved') return fail(400, { message: briefRevisionSentences[revision] });
		const refreshedTask = { ...task, buildBrief: brief.trim() };
		const outcome = await sendTaskToBuild(locals.supabase, refreshedTask, project, user.id);
		if (outcome.kind === 'refused') return fail(400, { message: outcome.sentence });
		return { message: 'Sent to build.' };
	}
};
