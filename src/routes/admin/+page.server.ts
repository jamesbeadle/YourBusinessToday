import { fail } from '@sveltejs/kit';
import { getAdminUserList } from '$lib/server/admin/getAdminUserList';
import { grantCredits } from '$lib/server/admin/grantCredits';
import { requireAdmin } from '$lib/server/admin/requireAdmin';
import { setAccountRestriction } from '$lib/server/admin/setAccountRestriction';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	await requireAdmin(locals);
	return { users: await getAdminUserList(locals.supabase) };
};

export const actions: Actions = {
	grantCredits: async ({ locals, request }) => {
		await requireAdmin(locals);
		const formData = await request.formData();
		const targetEmail = String(formData.get('targetEmail') ?? '');
		const creditAmount = Number(formData.get('creditAmount'));
		const note = String(formData.get('note') ?? 'promo').trim() || 'promo';
		if (targetEmail === '' || !Number.isInteger(creditAmount) || creditAmount <= 0) {
			return fail(400, { message: 'A user and a positive whole number of credits are required.' });
		}
		const newBalance = await grantCredits(locals.supabase, targetEmail, creditAmount, note);
		return { message: `Granted ${creditAmount} credits to ${targetEmail} — balance ${newBalance}.` };
	},
	setRestriction: async ({ locals, request }) => {
		await requireAdmin(locals);
		const formData = await request.formData();
		const targetEmail = String(formData.get('targetEmail') ?? '');
		const shouldRestrict = String(formData.get('shouldRestrict')) === 'true';
		if (targetEmail === '') return fail(400, { message: 'A user is required.' });
		await setAccountRestriction(locals.supabase, targetEmail, shouldRestrict);
		const restrictionState = shouldRestrict ? 'restricted' : 'unrestricted';
		return { message: `${targetEmail} is now ${restrictionState}.` };
	}
};
