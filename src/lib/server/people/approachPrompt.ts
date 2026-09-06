import type { AnthropicTool } from '$lib/server/anthropic/anthropicTypes';

export const approachTool: AnthropicTool = {
	name: 'record_approach',
	description: 'Record the drafted opening message and call plan for this person.',
	input_schema: {
		type: 'object',
		properties: {
			opening_message: {
				type: 'string',
				description:
					'A short first email or LinkedIn message to this person, in plain British English, ' +
					'under 150 words, no subject line, signed off with a first name placeholder.'
			},
			call_plan: {
				type: 'string',
				description:
					'A call plan as short lines: the one-sentence reason for the call, three questions ' +
					'to ask, the likely objection and how to answer it, and the ask to close on.'
			}
		},
		required: ['opening_message', 'call_plan']
	}
};

export const approachSystemPrompt = `You draft the first approach from Your Business Today, a
small UK software studio that builds internal tools, client portals and AI assistants for
businesses, to a person at a company we would like to work for.

You are given everything we hold on the company and the person: the researched profile,
the angles we think are worth opening with, the person's role and seniority, the links we
have on them, and the notes our staff have written after speaking to them or reading about
them. Write from that material only. Never invent a fact about them; if the notes are thin,
keep the message general and say so in the call plan.

Tone: direct, warm, specific, no hype and no marketing words. Lead with something true
about their business, say in one sentence what we do that touches it, and ask for a short
conversation. Address the person by first name.`;
