import { fail } from '@sveltejs/kit';
import { addContactLink, readNewContactLink } from '$lib/server/clients/addContactLink';
import { addContactNote } from '$lib/server/clients/addContactNote';
import { readCompanyProfileForm } from '$lib/server/clients/companyProfile';
import { removeContactLink } from '$lib/server/clients/removeContactLink';
import { requireStaff } from '$lib/server/auth/requireStaff';
import { updateCompanyProfile } from '$lib/server/clients/updateCompanyProfile';
import { readContactProfileEdit, updateContactProfile } from '$lib/server/clients/updateContactProfile';
import type { Actions } from './$types';

const contactRequired = { message: 'A contact is required.' };

export const personActions: Actions = {
	updateProfile: async ({ locals, params, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const website = String(formData.get('website') ?? '').trim();
		const profile = readCompanyProfileForm(formData);
		await updateCompanyProfile(locals.supabase, params.clientId, website, profile);
		return { message: 'Profile saved.' };
	},
	updateContact: async ({ locals, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const contactId = String(formData.get('contactId') ?? '');
		if (contactId === '') return fail(400, contactRequired);
		await updateContactProfile(locals.supabase, contactId, readContactProfileEdit(formData));
		return { message: 'Contact saved.' };
	},
	addLink: async ({ locals, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const contactId = String(formData.get('contactId') ?? '');
		const link = readNewContactLink(formData);
		if (contactId === '') return fail(400, contactRequired);
		if (link === null) return fail(400, { message: 'A label and a full web address are required.' });
		await addContactLink(locals.supabase, contactId, link);
		return { message: 'Link added.' };
	},
	removeLink: async ({ locals, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const linkId = String(formData.get('linkId') ?? '');
		if (linkId === '') return fail(400, { message: 'A link is required.' });
		await removeContactLink(locals.supabase, linkId);
		return { message: 'Link removed.' };
	},
	addNote: async ({ locals, request }) => {
		const user = await requireStaff(locals);
		const formData = await request.formData();
		const contactId = String(formData.get('contactId') ?? '');
		const body = String(formData.get('body') ?? '').trim();
		if (contactId === '') return fail(400, contactRequired);
		if (body === '') return fail(400, { message: 'A note needs some words.' });
		await addContactNote(locals.supabase, contactId, 'note', body, user.id);
		return { message: 'Note added.' };
	}
};
