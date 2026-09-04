import { getTriageQueue } from '$lib/server/requests/getTriageQueue';
import { parseFeatureRequestStatus } from '$lib/data/featureRequests';
import { requireStaff } from '$lib/server/auth/requireStaff';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	await requireStaff(locals);
	const requestedStatus = url.searchParams.get('status');
	const status = requestedStatus === null ? null : parseFeatureRequestStatus(requestedStatus);
	return {
		requests: await getTriageQueue(locals.supabase, status),
		status
	};
};
