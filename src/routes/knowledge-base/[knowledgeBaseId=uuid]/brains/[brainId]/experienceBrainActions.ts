import { fail, redirect } from '@sveltejs/kit';
import { bindInstanceBrain, unbindInstanceBrain } from '$lib/server/knowledge/brainBindings';
import { createBrainItem } from '$lib/server/knowledge/createBrainItem';
import { deleteBrainItem } from '$lib/server/knowledge/deleteBrainItem';
import { deleteKbBrain } from '$lib/server/knowledge/deleteKbBrain';
import { parseBrainItemForm } from '$lib/server/knowledge/parseBrainItemForm';
import { updateKbBrain } from '$lib/server/knowledge/updateKbBrain';
import { parseRetrievalConfig } from '$lib/data/knowledge/retrievalConfig';
import { knowledgeBaseHref } from '$lib/data/knowledge/knowledgeBaseRoutes';
import type { BrainType } from '$lib/data/knowledge/knowledgeTypes';
import { requireUser } from '$lib/server/auth/requireUser';
import type { Actions } from './$types';

export const experienceBrainActions: Actions = {
	createItem: async ({ locals, params, request }) => {
		await requireUser(locals);
		const item = parseBrainItemForm(await request.formData());
		if (item.itemKind === '') return fail(400, { message: 'Something went missing — try again.' });
		await createBrainItem(locals.supabase, { brainId: params.brainId, ...item });
	},
	deleteItem: async ({ locals, request }) => {
		await requireUser(locals);
		const formData = await request.formData();
		await deleteBrainItem(locals.supabase, String(formData.get('itemId') ?? ''));
	},
	saveRetrieval: async ({ locals, params, request }) => {
		await requireUser(locals);
		const formData = await request.formData();
		const retrievalConfig = parseRetrievalConfig(retrievalBrainTypeFrom(formData), {
			pipeline: String(formData.get('pipeline') ?? ''),
			topK: Number(formData.get('topK')),
			traversalDepth: Number(formData.get('traversalDepth')),
			recencyWeight: Number(formData.get('recencyWeight'))
		});
		await updateKbBrain(locals.supabase, params.brainId, { retrievalConfig });
	},
	bindDomain: async ({ locals, params, request }) => {
		await requireUser(locals);
		const formData = await request.formData();
		await bindInstanceBrain(
			locals.supabase,
			params.brainId,
			String(formData.get('domainBrainId') ?? '')
		);
	},
	unbindDomain: async ({ locals, params, request }) => {
		await requireUser(locals);
		const formData = await request.formData();
		await unbindInstanceBrain(
			locals.supabase,
			params.brainId,
			String(formData.get('domainBrainId') ?? '')
		);
	},
	deleteBrain: async ({ locals, params }) => {
		await requireUser(locals);
		await deleteKbBrain(locals.supabase, params.brainId);
		redirect(303, knowledgeBaseHref(params.knowledgeBaseId));
	}
};

function retrievalBrainTypeFrom(formData: FormData): BrainType {
	return String(formData.get('brainType') ?? 'vector_store') as BrainType;
}
