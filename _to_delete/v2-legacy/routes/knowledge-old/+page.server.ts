import { fail, redirect } from '@sveltejs/kit';
import { createKbBrain } from '$lib/server/knowledge/createKbBrain';
import { createKnowledgeBase } from '$lib/server/knowledge/createKnowledgeBase';
import { getKnowledgeBaseList } from '$lib/server/knowledge/getKnowledgeBaseList';
import { getUnfiledDomainBrains } from '$lib/server/knowledge/getUnfiledDomainBrains';
import { requireUser } from '$lib/server/auth/requireUser';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = await requireUser(locals);
	return {
		knowledgeBases: await getKnowledgeBaseList(locals.supabase),
		unfiledBrains: await getUnfiledDomainBrains(locals.supabase, user.id)
	};
};

export const actions: Actions = {
	createKnowledgeBase: async ({ locals, request }) => {
		await requireUser(locals);
		const formData = await request.formData();
		const name = String(formData.get('name') ?? '').trim();
		const description = String(formData.get('description') ?? '').trim();
		if (name === '') return fail(400, { message: 'A knowledge base needs a name.' });
		const knowledgeBaseId = await createKnowledgeBase(locals.supabase, name, description);
		redirect(303, `/knowledge/${knowledgeBaseId}`);
	},
	fileDomainBrain: async ({ locals, request }) => {
		await requireUser(locals);
		const formData = await request.formData();
		const knowledgeBaseId = String(formData.get('knowledgeBaseId') ?? '');
		const domainBrainId = String(formData.get('domainBrainId') ?? '');
		const brainName = String(formData.get('brainName') ?? '').trim();
		if (knowledgeBaseId === '' || domainBrainId === '') {
			return fail(400, { message: 'Pick a knowledge base to file this brain into.' });
		}
		await createKbBrain(locals.supabase, {
			knowledgeBaseId,
			category: 'domain',
			brainType: 'ddd_model',
			name: brainName,
			description: 'Filed from the workspace.',
			domainBrainId
		});
		redirect(303, `/knowledge/${knowledgeBaseId}`);
	}
};
