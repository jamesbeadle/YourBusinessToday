import type { ClientDocumentEntry } from '$lib/data/clientDocumentCatalogue';

const fileNamePrefix = 'Your Business Today';
const unsafeFileNameCharacters = /[^A-Za-z0-9 .-]+/g;

export function clientDocumentFileName(entry: ClientDocumentEntry): string {
	const readableTitle = entry.title.replace(unsafeFileNameCharacters, ' - ').replace(/\s+/g, ' ');
	return `${fileNamePrefix} - ${readableTitle.trim()}.docx`;
}
