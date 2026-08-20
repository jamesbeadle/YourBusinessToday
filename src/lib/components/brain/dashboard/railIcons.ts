export type SectionKey = 'terminal' | 'sources' | 'model' | 'log' | 'review' | 'share';

export const memberSections: SectionKey[] = ['terminal', 'sources', 'model', 'log'];

export const ownerSections: SectionKey[] = [...memberSections, 'review', 'share'];

export const sectionLabels: Record<SectionKey, string> = {
	terminal: 'Terminal',
	sources: 'Source documents',
	model: 'The model',
	log: 'The log',
	review: 'Review changes',
	share: 'Sharing'
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
	log: ['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01'],
	review: [
		'M6 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
		'M6 9v10',
		'M18 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
		'M18 15V9a4 4 0 0 0-4-4h-2',
		'M14 3l-2 2 2 2'
	],
	share: [
		'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
		'M3 20a6 6 0 0 1 12 0',
		'M18 8v6',
		'M15 11h6'
	]
};
