import { fail } from '@sveltejs/kit';
import { addChecklistItem } from '$lib/server/projects/addChecklistItem';
import { createChecklist } from '$lib/server/projects/createChecklist';
import { deleteChecklist } from '$lib/server/projects/deleteChecklist';
import { deleteChecklistItem } from '$lib/server/projects/deleteChecklistItem';
import { renameChecklist } from '$lib/server/projects/renameChecklist';
import { requireStaff } from '$lib/server/auth/requireStaff';
import { setChecklistItemDone } from '$lib/server/projects/setChecklistItemDone';
import type { Actions } from './$types';

export const checklistActions: Actions = {
	addChecklist: async ({ locals, params, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const title = String(formData.get('title') ?? '').trim();
		if (title === '') return fail(400, { message: 'A list needs a title.' });
		await createChecklist(locals.supabase, params.taskId, title);
		return {};
	},
	renameChecklist: async ({ locals, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const checklistId = String(formData.get('checklistId') ?? '');
		const title = String(formData.get('title') ?? '').trim();
		if (checklistId === '') return fail(400, { message: 'A list is required.' });
		if (title === '') return fail(400, { message: 'A list needs a title.' });
		await renameChecklist(locals.supabase, checklistId, title);
		return {};
	},
	deleteChecklist: async ({ locals, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const checklistId = String(formData.get('checklistId') ?? '');
		if (checklistId === '') return fail(400, { message: 'A list is required.' });
		await deleteChecklist(locals.supabase, checklistId);
		return {};
	},
	addChecklistItem: async ({ locals, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const checklistId = String(formData.get('checklistId') ?? '');
		const description = String(formData.get('description') ?? '').trim();
		if (checklistId === '') return fail(400, { message: 'A list is required.' });
		if (description === '') return fail(400, { message: 'An item needs some text.' });
		await addChecklistItem(locals.supabase, checklistId, description);
		return {};
	},
	setChecklistItemDone: async ({ locals, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const itemId = String(formData.get('itemId') ?? '');
		if (itemId === '') return fail(400, { message: 'An item is required.' });
		await setChecklistItemDone(locals.supabase, itemId, formData.get('isDone') === 'true');
		return {};
	},
	deleteChecklistItem: async ({ locals, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const itemId = String(formData.get('itemId') ?? '');
		if (itemId === '') return fail(400, { message: 'An item is required.' });
		await deleteChecklistItem(locals.supabase, itemId);
		return {};
	}
};
