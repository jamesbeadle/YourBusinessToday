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
	}
];
