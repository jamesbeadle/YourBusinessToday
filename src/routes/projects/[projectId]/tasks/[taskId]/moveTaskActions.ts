import { fail, redirect } from '@sveltejs/kit';
import { getProject } from '$lib/server/projects/getProject';
import { getTask } from '$lib/server/projects/getTask';
import { moveTaskToProject } from '$lib/server/projects/moveTaskToProject';
import { requireProjectAccess } from '$lib/server/auth/requireProjectAccess';
import type { Actions } from './$types';

const pickAProject = 'Choose another project you are on to move this task to.';

export const moveTaskActions = {
	moveToProject: async ({ locals, params, request }) => {
		const { user, project } = await requireProjectAccess(locals, params.projectId);
		const destinationProjectId = String(
			(await request.formData()).get('destinationProjectId') ?? ''
		);
		if (destinationProjectId === '' || destinationProjectId === project.id) {
			return fail(400, { message: pickAProject });
		}
		const [task, destination] = await Promise.all([
			getTask(locals.supabase, params.taskId),
			getProject(locals.supabase, destinationProjectId)
		]);
		if (task === null) return fail(404, { message: 'Task not found.' });
		if (destination === null) return fail(400, { message: pickAProject });
		await moveTaskToProject(locals.supabase, {
			task,
			source: project,
			destination,
			movedByAccountId: user.id
		});
		redirect(303, `/projects/${destination.id}/tasks/${task.id}`);
	}
} satisfies Actions;
