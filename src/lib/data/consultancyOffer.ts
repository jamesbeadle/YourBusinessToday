export type OfferStep = {
	id: string;
	name: string;
	terms: string;
	description: string;
	deliverable: string;
};

export const offerDocumentPath = '/documents/your-business-today-offer.pdf';

export const consultancyOfferSteps: OfferStep[] = [
	{
		id: 'discovery',
		name: 'Map your data sources',
		terms: 'Two weeks · fixed price · no commitment to go further',
		description:
			'Every business creates its data somewhere: the sheet a quote is worked out in, the document a report is typed into, the message a job is agreed on, the photograph that proves the work was done. We spend two weeks with the people who make them, and we map every source.',
		deliverable:
			'A written map of your data sources: what each one creates, who creates it, what it is made from, and where it goes next. With it, the order the harness should take them in and a fixed price for building it. Yours to keep whether or not you take it further.'
	},
	{
		id: 'harness',
		name: 'Build the harness',
		terms: 'The first build stage · six to eight weeks · agreed before it starts',
		description:
			'The harness is one place that holds what those sources hold. It is almost always a SQL database: a table for each thing your business makes, a column for each fact about it, every value checked at the door so nothing goes in that does not fit. Your people keep working the way they work; the harness is where the result now lives.',
		deliverable:
			'Your data in one typed, checked store you can see and query, with the first sources retired into it. From this stage on you have dashboards over the harness and an MCP server on it, both live from the first week.'
	},
	{
		id: 'skills',
		name: 'Teach the agent the processes',
		terms: 'One process a stage · agreed before it starts · stop after any stage',
		description:
			'Around the harness sit the complex processes: the valuation assembled every month, the report written from the week on site, the chase for the invoice that is late. We write each one as a skill that an LLM agent, your own Claude or ChatGPT, runs from start to finish, reading the harness for its inputs and writing its outputs back into it.',
		deliverable:
			'One process running itself, with the judgement left to the person who has it and the assembling, typing and chasing done by the agent. Every output lands in the harness, so the next process can start from it.'
	},
	{
		id: 'doors',
		name: 'Two doors on the harness',
		terms: 'Included with the harness · grows with every skill',
		description:
			'Everything in the harness is reached through two doors. Dashboards show it the way any software would: a screen for each table, a view for each question people ask of it. The MCP server does exactly what the website does, from inside the agent: the same actions, the same checks, no browser in the middle.',
		deliverable:
			'One set of roles deciding who may see and do what, enforced on both doors alike. A person who cannot approve an invoice on the screen cannot approve it through Claude either.'
	},
	{
		id: 'run',
		name: 'Run it',
		terms: 'One monthly fee · cancel on a month’s notice',
		description:
			'Once a stage is paid for, the harness, the skills and the doors are yours, and so is the written record of how your business works. Most businesses ask us to stay, because the work never stops changing: a new process to teach, a new table the business now needs.',
		deliverable:
			'The thing kept running and kept current, with hosting, monitoring, backups, updates and support inside one monthly figure, a portal your people raise requests in, and a standing day of change work each month.'
	}
];
