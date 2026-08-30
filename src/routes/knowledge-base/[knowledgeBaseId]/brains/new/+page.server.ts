import { error, fail, redirect } from '@sveltejs/kit';
import { bindInstanceBrain } from '$lib/server/knowledge/brainBindings';
import { createKbBrain } from '$lib/server/knowledge/createKbBrain';
import { createLinkedDomainBrain, findOrCreateEntity } from '$lib/server/knowledge/createLinkedDomainBrain';
import { createWorkflow } from '$lib/server/entities/createWorkflow';
import { getKbBrains } from '$lib/server/knowledge/getKbBrains';
import { getKnowledgeBase } from '$lib/server/knowledge/getKnowledgeBase';
import { touchKnowledgeBase } from '$lib/server/knowledge/updateKnowledgeBase';
import { requireUser } from '$lib/server/auth/requireUser';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	await requireUser(locals);
	const knowledgeBase = await getKnowledgeBase(locals.supabase, params.knowledgeBaseId);
	if (knowledgeBase === null) error(404, 'That knowledge base is not yours to open');
	const brains = await getKbBrains(locals.supabase, knowledgeBase.id);
	return {
		knowledgeBase,
		domainBrains: brains.filter((brain) => brain.category === 'domain')
	};
};

export const actions: Actions = {
	createBrain: async ({ locals, params, request }) => {
		await requireUser(locals);
		const formData = await request.formData();
		const kind = String(formData.get('kind') ?? '');
		const name = String(formData.get('name') ?? '').trim();
		const description = String(formData.get('description') ?? '').trim();
		if (!['expertise', 'experience', 'process'].includes(kind)) {
			return fail(400, { message: 'Pick a kind of brain first.' });
		}
		if (name === '') return fail(400, { message: 'A brain needs a name.' });
		const knowledgeBase = await getKnowledgeBase(locals.supabase, params.knowledgeBaseId);
		if (knowledgeBase === null) return fail(404, { message: 'Knowledge base not found.' });
		if (kind === 'process') {
			const workflowId = await createProcessBrain(locals, knowledgeBase.name, name);
			await touchKnowledgeBase(locals.supabase, knowledgeBase.id);
			redirect(303, `/knowledge-base/${knowledgeBase.id}`);
			void workflowId;
		}
		const brainId = await createStoredBrain(locals, knowledgeBase, kind, name, description);
		await bindSelectedExpertise(locals, brainId, formData.getAll('boundDomainBrainIds'));
		await touchKnowledgeBase(locals.supabase, knowledgeBase.id);
		redirect(303, `/knowledge-base/${knowledgeBase.id}/brains/${brainId}`);
	}
};

async function createProcessBrain(
	locals: App.Locals,
	knowledgeBaseName: string,
	name: string
): Promise<string> {
	const entityId = await findOrCreateEntity(locals.supabase, knowledgeBaseName);
	return createWorkflow(locals.supabase, entityId, name);
}

async function createStoredBrain(
	locals: App.Locals,
	knowledgeBase: { id: string; name: string },
	kind: string,
	name: string,
	description: string
): Promise<string> {
	const isExpertise = kind === 'expertise';
	return createKbBrain(locals.supabase, {
		knowledgeBaseId: knowledgeBase.id,
		category: isExpertise ? 'domain' : 'instance',
		brainType: isExpertise ? 'ddd_model' : 'episodic_log',
		name,
		description,
		domainBrainId: isExpertise
			? await createLinkedDomainBrain(locals.supabase, knowledgeBase.name, name, description)
			: undefined
	});
}

async function bindSelectedExpertise(
	locals: App.Locals,
	instanceBrainId: string,
	selectedIds: FormDataEntryValue[]
): Promise<void> {
	for (const selectedId of selectedIds) {
		await bindInstanceBrain(locals.supabase, instanceBrainId, String(selectedId));
	}
}
