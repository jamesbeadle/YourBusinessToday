export const pdfPageMarker = (pageNumber: number) => `--- page ${pageNumber} ---`;

/** One block per page, each under its marker; an empty string when no page carries any text. */
export function markPdfPages(pageTexts: string[]): string {
	if (pageTexts.every(isBlank)) return '';
	return pageTexts.map(markedPage).join('\n\n');
}

function markedPage(pageText: string, index: number): string {
	return `${pdfPageMarker(index + 1)}\n${pageText.trim()}`;
}

function isBlank(pageText: string): boolean {
	return pageText.trim() === '';
}
