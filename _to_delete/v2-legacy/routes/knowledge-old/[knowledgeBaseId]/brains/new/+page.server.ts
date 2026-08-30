import { error, fail, redirect } from '@sveltejs/kit';
import { bindInstanceBrain } from '$lib/server/knowledge/brainBindings';
import { createKbBrain } from '$lib/server/knowledge/createKbBrain';
import { createLinkedDomainBrain } from '$lib/server/knowledge/createLinkedDomainBrain';
import { getKbBrains } from '$lib/server/knowledge/getKbBrains';
import { getKnowledgeBase } from '$lib/server/knowledge/getKnowledgeBase';
import { touchKnowledgeBase } from '$lib/server/knowledge/updateKnowledgeBase';
import { findBrainType } from '$lib/data/knowledge/brainTypeCatalog';
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
		const definition = findBrainType(String(formData.get('brainType') ?? ''));
		const name = String(formData.get('name') ?? '').trim();
		const description = String(formData.get('description') ?? '').trim();
		if (definition === null) return fail(400, { message: 'Pick a brain type first.' });
		if (name === '') return fail(400, { message: 'A brain needs a name.' });
		const knowledgeBase = await getKnowledgeBase(locals.supabase, params.knowledgeBaseId);
		if (knowledgeBase === null) return fail(404, { message: 'Knowledge base not found.' });
		const brainId = await createKbBrain(locals.supabase, {
			knowledgeBaseId: knowledgeBase.id,
			category: definition.category,
			brainType: definition.type,
			name,
			description,
			domainBrainId: await linkedDomainBrainIdFor(locals, definition.type, knowledgeBase.name, name, description)
		});
		await bindSelectedDomains(locals, brainId, formData.getAll('boundDomainBrainIds'));
		await touchKnowledgeBase(locals.supabase, knowledgeBase.id);
		redirect(303, `/knowledge/${knowledgeBase.id}/brains/${brainId}`);
	}
};

async function linkedDomainBrainIdFor(
	locals: App.Locals,
	brainType: string,
	knowledgeBaseName: string,
	brainName: string,
	domainGoal: string
): Promise<string | undefined> {
	if (brainType !== 'ddd_model') return undefined;
	return createLinkedDomainBrain(locals.supabase, knowledgeBaseName, brainName, domainGoal);
}

async function bindSelectedDomains(
	locals: App.Locals,
	instanceBrainId: string,
	selectedIds: FormDataEntryValue[]
): Promise<void> {
	for (const selectedId of selectedIds) {
		await bindInstanceBrain(locals.supabase, instanceBrainId, String(selectedId));
	}
}
