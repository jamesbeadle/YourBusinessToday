const pageWriteSchema = {
	type: 'object',
	required: ['operation', 'slug', 'title', 'summary', 'category', 'body'],
	properties: {
		operation: { type: 'string', enum: ['create', 'update'] },
		slug: { type: 'string', description: 'Kebab-case, permanent.' },
		title: { type: 'string' },
		summary: { type: 'string', description: 'One line that makes the index useful.' },
		category: { type: 'string' },
		body: { type: 'string', description: 'The complete markdown body, never a fragment.' }
	}
};

export const updateWikiTool = {
	name: 'update_wiki',
	description:
		'Record everything this source document adds to the wiki: the source summary, ' +
		'every page create or update it demands, and one log line.',
	input_schema: {
		type: 'object',
		required: ['sourceSummary', 'pageWrites', 'logLine'],
		properties: {
			sourceSummary: {
				type: 'string',
				description: 'One line saying what this source document is.'
			},
			pageWrites: { type: 'array', maxItems: 8, items: pageWriteSchema },
			logLine: { type: 'string', description: 'One line describing what you did.' }
		}
	}
};
