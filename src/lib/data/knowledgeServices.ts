export type KnowledgeService = {
	id: string;
	name: string;
	tagline: string;
	description: string;
	isLive: boolean;
	href?: string;
};

export const knowledgeServices: KnowledgeService[] = [
	{
		id: 'trade-talk',
		name: 'Trade Talk',
		tagline: 'Ask every trade at once',
		description:
			'One question, answered by the second brains of approved trades — real businesses, real knowledge, not scraped content. Every brain that shapes an answer earns its owner a share of the revenue.',
		isLive: true,
		href: '/trade-talk'
	},
	{
		id: 'marketplace',
		name: 'The Marketplace',
		tagline: 'Buy and sell expertise',
		description:
			'List an edition of your expertise brain and other businesses can buy it for credits — a snapshot of what you know, sold on your terms. Or buy your way into a trade you are entering.',
		isLive: true,
		href: '/market'
	},
	{
		id: 'workforce',
		name: 'The Workforce',
		tagline: 'Runs your processes',
		description:
			'Reads your process brain to score every task for AI coverage, plans the handover in the right order, then puts agents on shift to do the work — every run, every escalation to a human, visible as it happens.',
		isLive: false
	},
	{
		id: 'prospector',
		name: 'The Prospector',
		tagline: 'Finds who your experience says is next',
		description:
			'Learns what your best clients look like from the jobs you have actually done, hunts the open web and company registries for businesses that match, and builds a scored, contactable pipeline.',
		isLive: false
	}
];
