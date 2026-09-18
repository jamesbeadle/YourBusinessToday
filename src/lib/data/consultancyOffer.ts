export type OfferStep = {
	id: string;
	name: string;
	terms: string;
	description: string;
	deliverable: string;
};

export const consultancyOfferSteps: OfferStep[] = [
	{
		id: 'discovery',
		name: 'Discovery',
		terms: 'Two weeks · fixed price · no commitment to go further',
		description:
			'We spend two weeks with the people who actually do the work. We sit with them, watch what arrives and what they do with it, and read the documents you already have. We are after how the business really runs on a bad week, not how the handbook says it runs.',
		deliverable:
			'A written map of how work moves through your business, a list of what is worth automating in the order worth doing it, and a fixed price for the first build. Yours to keep whether or not you take it further.'
	},
	{
		id: 'build',
		name: 'Build',
		terms: 'Six to eight weeks a stage · agreed before it starts · stop after any stage',
		description:
			'We take the first thing on the list and build it. One piece at a time, each one in use and earning before the next is started, so you are never carrying a half-finished project.',
		deliverable:
			'One piece of work live and in use, built around how your people already work rather than a product they have to adopt. Every stage is agreed before it begins, so there is no open cheque.'
	},
	{
		id: 'hand-over',
		name: 'Hand over',
		terms: 'At the end of each build · included',
		description:
			'Once the stage is paid for, what we built is yours, and so is the written record of how your business works that we produced along the way. Your people are shown how it works by whoever built it.',
		deliverable:
			'Ownership, the record, and no lock-in. We are not a dependency you cannot leave — that is deliberate, and it is in our terms.'
	},
	{
		id: 'run',
		name: 'Run it',
		terms: 'One monthly fee · cancel on a month’s notice',
		description:
			'Most businesses want us to stay, because the work never stops changing. From day one you have your own portal: every project and every request at the stage it is really at, with a standing day of change work each month.',
		deliverable:
			'The thing kept running and kept current — hosting, the platform it runs on, monitoring, backups, updates and support inside the one monthly figure — a portal your people can raise a request in, and a connection that lets your own Claude read a job without opening the site.'
	}
];
