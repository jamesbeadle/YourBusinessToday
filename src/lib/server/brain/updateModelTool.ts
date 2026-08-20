const domainBlockKinds = [
	'entity',
	'value_object',
	'aggregate',
	'domain_service',
	'domain_event',
	'glossary',
	'context_map'
];

const contextWriteSchema = {
	type: 'object',
	required: ['slug', 'name', 'summary'],
	properties: {
		slug: { type: 'string', description: 'Kebab-case, permanent.' },
		name: { type: 'string', description: 'The context name in the business’s own words.' },
		summary: { type: 'string', description: 'One line saying what model lives here.' },
		isCoreDomain: {
			type: 'boolean',
			description: 'True only for the one context that is the business’s distinctive value.'
		}
	}
};

export const pageWriteSchema = {
	type: 'object',
	required: ['operation', 'slug', 'title', 'summary', 'kind', 'contextSlug', 'body'],
	properties: {
		operation: { type: 'string', enum: ['create', 'update'] },
		slug: { type: 'string', description: 'Kebab-case, permanent.' },
		title: { type: 'string' },
		summary: { type: 'string', description: 'One line that makes the index useful.' },
		kind: { type: 'string', enum: domainBlockKinds },
		contextSlug: {
			type: 'string',
			description: 'The bounded context this page lives in. Empty only for the context map.'
		},
		body: { type: 'string', description: 'The complete markdown body, never a fragment.' }
	}
};

export const updateModelTool = {
	name: 'update_model',
	description:
		'Record everything this source document adds to the domain model: the source summary, ' +
		'any bounded context creates or updates, every page write it demands, and one log line.',
	input_schema: {
		type: 'object',
		required: ['sourceSummary', 'pageWrites', 'logLine'],
		properties: {
			sourceSummary: {
				type: 'string',
				description: 'One line saying what this source document is.'
			},
			contextWrites: { type: 'array', maxItems: 4, items: contextWriteSchema },
			pageWrites: { type: 'array', maxItems: 10, items: pageWriteSchema },
			logLine: { type: 'string', description: 'One line describing what you did.' }
		}
	}
};
