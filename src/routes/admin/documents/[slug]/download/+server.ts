import { error } from '@sveltejs/kit';
import { findClientDocumentEntry } from '$lib/data/clientDocumentCatalogue';
import { requireAdmin } from '$lib/server/admin/requireAdmin';
import { attachmentResponse } from '$lib/server/clientDocuments/attachmentResponse';
import { clientDocumentFileName } from '$lib/server/clientDocuments/clientDocumentFileName';
import {
	buildWordDocument,
	wordDocumentContentType
} from '$lib/server/clientDocuments/docx/buildWordDocument';
import { readClientDocumentMarkdown } from '$lib/server/clientDocuments/readClientDocumentMarkdown';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params }) => {
	await requireAdmin(locals);
	const entry = findClientDocumentEntry(params.slug);
	const markdown = readClientDocumentMarkdown(params.slug);
	if (!entry || markdown === undefined) error(404, 'There is no such document.');
	return attachmentResponse(
		buildWordDocument(markdown),
		clientDocumentFileName(entry),
		wordDocumentContentType
	);
};
