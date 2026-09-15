import { extractText, getDocumentProxy } from 'unpdf';
import { markPdfPages } from '$lib/data/pdfPageMarkers';

/** The PDF's text with a marker before each page; empty when it has no text layer, as a scan has none. */
export async function extractPdfText(fileBytes: Uint8Array): Promise<string> {
	const document = await getDocumentProxy(fileBytes);
	const { text: pageTexts } = await extractText(document, { mergePages: false });
	return markPdfPages(pageTexts);
}
