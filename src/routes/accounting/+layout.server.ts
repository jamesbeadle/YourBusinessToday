import { requireAdmin } from '$lib/server/admin/requireAdmin';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	await requireAdmin(locals);
	return {};
};
