import { fail } from '@sveltejs/kit';
import { createGoal, readNewGoalSeed } from '$lib/server/goals/createGoal';
import { deleteGoal } from '$lib/server/goals/deleteGoal';
import { requireStaff } from '$lib/server/auth/requireStaff';
import type { Actions } from './$types';

export const goalActions = {
	createGoal: async ({ locals, params, request }) => {
		const user = await requireStaff(locals);
		const seed = readNewGoalSeed(await request.formData());
		if (seed === null) return fail(400, { message: 'A goal needs a title.' });
		await createGoal(locals.supabase, params.projectId, seed, user.id);
		return { message: `Goal "${seed.title}" added.` };
	},
	deleteGoal: async ({ locals, request }) => {
		await requireStaff(locals);
		const goalId = String((await request.formData()).get('goalId') ?? '');
		if (goalId === '') return fail(400, { message: 'A goal is required.' });
		await deleteGoal(locals.supabase, goalId);
		return {};
	}
} satisfies Actions;
