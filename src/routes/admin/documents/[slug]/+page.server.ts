import { error } from '@sveltejs/kit';
import { marked } from 'marked';
import { findClientDocumentEntry } from '$lib/data/clientDocumentCatalogue';
import { requireAdmin } from '$lib/server/admin/requireAdmin';
import { readClientDocumentMarkdown } from '$lib/server/clientDocuments/readClientDocumentMarkdown';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	await requireAdmin(locals);
	const entry = findClientDocumentEntry(params.slug);
	const markdown = readClientDocumentMarkdown(params.slug);
	if (!entry || markdown === undefined) error(404, 'There is no such document.');
	return { entry, documentHtml: await marked.parse(markdown) };
};
