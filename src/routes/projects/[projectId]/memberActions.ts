import { fail } from '@sveltejs/kit';
import { addProjectMember } from '$lib/server/members/addProjectMember';
import { findAccountByEmail } from '$lib/server/accounts/findAccountByEmail';
import { removeProjectMember } from '$lib/server/members/removeProjectMember';
import { requireAdmin } from '$lib/server/admin/requireAdmin';
import { requireUser } from '$lib/server/auth/requireUser';
import type { Actions } from './$types';

export const memberActions = {
	addMember: async ({ locals, params, request }) => {
		await requireAdmin(locals);
		const user = await requireUser(locals);
		const email = String((await request.formData()).get('email') ?? '').trim();
		const account = await findAccountByEmail(locals.supabase, email);
		if (account === null) {
			return fail(400, { message: 'Nobody has signed up with that address yet.' });
		}
		await addProjectMember(locals.supabase, params.projectId, account.id, user.id);
		return { message: `${account.name} can now reach this project.` };
	},
	removeMember: async ({ locals, params, request }) => {
		await requireAdmin(locals);
		const accountId = String((await request.formData()).get('accountId') ?? '');
		if (accountId === '') return fail(400, { message: 'A member is required.' });
		await removeProjectMember(locals.supabase, params.projectId, accountId);
		return {};
	}
} satisfies Actions;
