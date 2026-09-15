import { describe, expect, it } from 'vitest';
import { markPdfPages } from './pdfPageMarkers';

describe('markPdfPages', () => {
	it('puts a marker before each page', () => {
		expect(markPdfPages(['First ', '', 'Third'])).toBe(
			'--- page 1 ---\nFirst\n\n--- page 2 ---\n\n\n--- page 3 ---\nThird'
		);
	});

	it('is empty when no page has a text layer', () => {
		expect(markPdfPages(['', '  \n'])).toBe('');
		expect(markPdfPages([])).toBe('');
	});
});
