import { fail } from '@sveltejs/kit';
import {
	approveHiveApplication,
	getHiveReviewQueue,
	rejectHiveApplication
} from '$lib/server/hive/hiveReview';
import { deleteUserAccount } from '$lib/server/admin/deleteUserAccount';
import { getAdminUserList } from '$lib/server/admin/getAdminUserList';
import { getSiteModel } from '$lib/server/anthropic/getSiteModel';
import { grantCredits } from '$lib/server/admin/grantCredits';
import { isKnownSiteModel } from '$lib/data/siteModels';
import { requireAdmin } from '$lib/server/admin/requireAdmin';
import { setAccountRestriction } from '$lib/server/admin/setAccountRestriction';
import { setSiteModel } from '$lib/server/admin/setSiteModel';
import { setStaffAccess } from '$lib/server/admin/setStaffAccess';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	await requireAdmin(locals);
	return {
		users: await getAdminUserList(locals.supabase),
		siteModel: await getSiteModel(),
		hiveApplications: await getHiveReviewQueue(locals.supabase)
	};
};

export const actions: Actions = {
	setSiteModel: async ({ locals, request }) => {
		await requireAdmin(locals);
		const formData = await request.formData();
		const modelId = String(formData.get('modelId') ?? '');
		if (!isKnownSiteModel(modelId)) {
			return fail(400, { message: 'Choose one of the listed models.' });
		}
		await setSiteModel(locals.supabase, modelId);
		return { message: `The site now runs on ${modelId}.` };
	},
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
	approveHiveApplication: async ({ locals, request }) => {
		await requireAdmin(locals);
		const formData = await request.formData();
		const applicationId = String(formData.get('applicationId') ?? '');
		if (applicationId === '') return fail(400, { message: 'An application is required.' });
		await approveHiveApplication(locals.supabase, applicationId);
		return { message: 'Approved — the brain has joined the hive with a fresh snapshot.' };
	},
	rejectHiveApplication: async ({ locals, request }) => {
		await requireAdmin(locals);
		const formData = await request.formData();
		const applicationId = String(formData.get('applicationId') ?? '');
		const note = String(formData.get('note') ?? '').trim();
		if (applicationId === '') return fail(400, { message: 'An application is required.' });
		await rejectHiveApplication(locals.supabase, applicationId, note);
		return { message: 'Application rejected — the owner sees the note on their brain.' };
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
	},
	setStaff: async ({ locals, request }) => {
		await requireAdmin(locals);
		const formData = await request.formData();
		const targetEmail = String(formData.get('targetEmail') ?? '');
		const shouldBeStaff = String(formData.get('shouldBeStaff')) === 'true';
		if (targetEmail === '') return fail(400, { message: 'A user is required.' });
		await setStaffAccess(locals.supabase, targetEmail, shouldBeStaff);
		const staffState = shouldBeStaff ? 'now staff' : 'no longer staff';
		return { message: `${targetEmail} is ${staffState}.` };
	},
	deleteUser: async ({ locals, request }) => {
		await requireAdmin(locals);
		const formData = await request.formData();
		const targetEmail = String(formData.get('targetEmail') ?? '');
		if (targetEmail === '') return fail(400, { message: 'A user is required.' });
		try {
			await deleteUserAccount(locals.supabase, targetEmail);
		} catch {
			return fail(400, {
				message: `${targetEmail} could not be deleted — admin accounts and accounts that own team data are protected.`
			});
		}
		return { message: `${targetEmail} has been deleted.` };
	}
};
