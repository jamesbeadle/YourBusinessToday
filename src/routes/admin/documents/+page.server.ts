import { clientDocumentsFor } from '$lib/data/clientDocumentCatalogue';
import { requireAdmin } from '$lib/server/admin/requireAdmin';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	await requireAdmin(locals);
	return {
		contractDocuments: clientDocumentsFor('client'),
		procedureDocuments: clientDocumentsFor('internal')
	};
};
