import { workflowModelSchema } from './workflowModelSchema';

const expertiseFactSchema = {
	type: 'string',
	description:
		'One durable rule, term, or constraint of the trade, stated as a standalone sentence.'
};

const experienceEventSchema = {
	type: 'object',
	required: ['title'],
	properties: {
		title: { type: 'string', description: 'What happened, short, starting with a verb.' },
		note: { type: 'string', description: 'The detail in the owner’s own words.' },
		occurredAt: {
			type: 'string',
			description: 'ISO date if the owner said when it happened; omit otherwise.'
		}
	}
};

export const workspaceUpdateTool = {
	name: 'update_workspace',
	description:
		'Return your conversational reply to the business owner together with the complete ' +
		'updated Process Map model, plus any expertise and experience harvested this turn.',
	input_schema: {
		type: 'object',
		required: ['reply', 'map'],
		properties: {
			reply: { type: 'string', description: 'Your next question or remark, under 120 words.' },
			map: workflowModelSchema,
			expertiseFacts: {
				type: 'array',
				items: expertiseFactSchema,
				description:
					'Durable trade knowledge NEWLY stated in the owner’s latest message — rules, ' +
					'standards, vocabulary. Empty when the message adds none.'
			},
			experienceEvents: {
				type: 'array',
				items: experienceEventSchema,
				description:
					'Things that actually happened, NEWLY stated in the owner’s latest message — ' +
					'jobs, incidents, decisions. Empty when the message adds none.'
			}
		}
	}
};
