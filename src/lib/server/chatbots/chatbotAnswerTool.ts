import { answerTool } from '../brain/modellerAnswerTools';

export const chatbotAnswerTool = {
	name: answerTool.name,
	description:
		'Deliver the final answer, grounded in the pages read, and name anything the knowledge ' +
		'base could not answer.',
	input_schema: {
		type: 'object',
		required: ['answerMarkdown', 'citedSlugs'],
		properties: {
			...answerTool.input_schema.properties,
			missingKnowledge: {
				type: 'string',
				description:
					'Only when the pages could not answer the question, in full or in part: the one ' +
					'question the knowledge base owner needs to answer, in a line, phrased so they can ' +
					'answer it directly. Leave it out when the pages answered the question.'
			}
		}
	}
};
