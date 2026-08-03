import { error } from '@sveltejs/kit';
import { exportDomainBrain } from '$lib/server/brain/exportDomainBrain';
import { recordBrainEvent } from '$lib/server/brain/recordBrainEvent';
import type { RequestHandler } from './$types';

const exportFilename = 'domain-brain.zip';

export const GET: RequestHandler = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (user === null) error(401, 'Sign in to export your Domain Brain');

	const zipBytes = await exportDomainBrain(locals.supabase);
	await recordBrainEvent(locals.supabase, { kind: 'brain_exported', detail: {} });
	return new Response(new Uint8Array(zipBytes), {
		headers: {
			'content-type': 'application/zip',
			'content-disposition': `attachment; filename="${exportFilename}"`
		}
	});
};
