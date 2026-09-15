import { describe, expect, it } from 'vitest';
import { csvLine } from './csvLine';

describe('csvLine', () => {
	it('joins plain values with commas', () => {
		expect(csvLine(['Item', 'Cost', ''])).toBe('Item,Cost,');
	});

	it('quotes a value holding a comma, a quote or a line break', () => {
		expect(csvLine(['a, b', 'say "hi"', 'two\nlines'])).toBe('"a, b","say ""hi""","two\nlines"');
	});
});
