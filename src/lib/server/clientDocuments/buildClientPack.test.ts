import { unzipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { clientDocumentsFor } from '$lib/data/clientDocumentCatalogue';
import { buildClientPack } from './buildClientPack';

describe('buildClientPack', () => {
	it('holds one numbered Word document for every contract in the stack, and no procedures', () => {
		const fileNames = Object.keys(unzipSync(buildClientPack()));
		expect(fileNames).toHaveLength(clientDocumentsFor('client').length);
		expect(fileNames[0]).toBe('01 Your Business Today - Master Services Agreement.docx');
		expect(fileNames.some((fileName) => fileName.includes('Breach'))).toBe(false);
	});
});
