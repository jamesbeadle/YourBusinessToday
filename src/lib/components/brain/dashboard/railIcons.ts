export type SectionKey = 'terminal' | 'sources' | 'model' | 'log';

export const sectionOrder: SectionKey[] = ['terminal', 'sources', 'model', 'log'];

export const sectionLabels: Record<SectionKey, string> = {
	terminal: 'Terminal',
	sources: 'Source documents',
	model: 'The model',
	log: 'The log'
};

export const sectionIconPaths: Record<SectionKey, string[]> = {
	terminal: ['M4 17l6-5-6-5', 'M12 19h8'],
	sources: ['M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8z', 'M14 3v5h5'],
	model: [
		'M6 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
		'M18 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
		'M10 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
		'M7.6 6.2 16.2 8.6',
		'M9.4 16.4 6.6 8.9',
		'M11.8 17.2 16.8 9.8'
	],
	log: ['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01']
};
