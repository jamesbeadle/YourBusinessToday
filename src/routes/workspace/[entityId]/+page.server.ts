import { error, fail, redirect } from '@sveltejs/kit';
import { createDomainBrain } from '$lib/server/entities/createDomainBrain';
import { createWorkflow } from '$lib/server/entities/createWorkflow';
import { deleteEntity } from '$lib/server/entities/deleteEntity';
import { getDomainBrains } from '$lib/server/entities/getDomainBrains';
import { getEntity } from '$lib/server/entities/getEntity';
import { getWorkflows } from '$lib/server/entities/getWorkflows';
import { renameEntity } from '$lib/server/entities/renameEntity';
import { requireUser } from '$lib/server/auth/requireUser';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	await requireUser(locals);
	const entity = await getEntity(locals.supabase, params.entityId);
	if (entity === null) error(404, 'That entity is not in your workspace');
	return {
		entity,
		domainBrains: await getDomainBrains(locals.supabase, entity.id),
		workflows: await getWorkflows(locals.supabase, entity.id)
	};
};

export const actions: Actions = {
	createDomainBrain: async ({ locals, params, request }) => {
		await requireUser(locals);
		const name = await readName(request);
		if (name === '') return fail(400, { message: 'A domain brain needs a name.' });
		const brainId = await createDomainBrain(locals.supabase, params.entityId, name);
		redirect(303, `/workspace/${params.entityId}/domains/${brainId}`);
	},
	createWorkflow: async ({ locals, params, request }) => {
		await requireUser(locals);
		const name = await readName(request);
		if (name === '') return fail(400, { message: 'A workflow needs a name.' });
		const workflowId = await createWorkflow(locals.supabase, params.entityId, name);
		redirect(303, `/workspace/${params.entityId}/workflows/${workflowId}`);
	},
	renameEntity: async ({ locals, params, request }) => {
		await requireUser(locals);
		const name = await readName(request);
		if (name === '') return fail(400, { message: 'An entity needs a name.' });
		await renameEntity(locals.supabase, params.entityId, name);
		return {};
	},
	deleteEntity: async ({ locals, params }) => {
		await requireUser(locals);
		await deleteEntity(locals.supabase, params.entityId);
		redirect(303, '/workspace');
	}
};

async function readName(request: Request): Promise<string> {
	const formData = await request.formData();
	return String(formData.get('name') ?? '').trim();
}
