import { fail, redirect } from '@sveltejs/kit';
import { getNotificationList } from '$lib/server/notifications/getNotificationList';
import { getStaffDirectory } from '$lib/server/projects/getStaffDirectory';
import { markAllNotificationsRead } from '$lib/server/notifications/markAllNotificationsRead';
import { markNotificationRead } from '$lib/server/notifications/markNotificationRead';
import { requireStaff } from '$lib/server/auth/requireStaff';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = await requireStaff(locals);
	return {
		notifications: await getNotificationList(locals.supabase, user.id),
		staffMembers: await getStaffDirectory(locals.supabase)
	};
};

export const actions: Actions = {
	openNotification: async ({ locals, request }) => {
		await requireStaff(locals);
		const formData = await request.formData();
		const notificationId = String(formData.get('notificationId') ?? '');
		const projectId = String(formData.get('projectId') ?? '');
		const taskId = String(formData.get('taskId') ?? '');
		if (notificationId === '' || projectId === '' || taskId === '') {
			return fail(400, { message: 'A notification is required.' });
		}
		await markNotificationRead(locals.supabase, notificationId);
		redirect(303, `/projects/${projectId}/tasks/${taskId}`);
	},
	markAllRead: async ({ locals }) => {
		const user = await requireStaff(locals);
		await markAllNotificationsRead(locals.supabase, user.id);
		return {};
	}
};
