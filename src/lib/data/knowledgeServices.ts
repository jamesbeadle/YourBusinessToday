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
		id: 'hive-mind',
		name: 'The Hive Mind',
		tagline: 'Shares your expertise — and pays you for it',
		description:
			'Brains that pass review join a hive of specialists — snapshots of what real businesses actually know. One query consults every specialty that can help, and each brain that shapes the answer earns its owner credits.',
		isLive: true,
		href: '/hive-mind'
	},
	{
		id: 'workforce',
		name: 'The Workforce',
		tagline: 'Runs your processes',
		description:
			'Reads your process map to score every task for AI coverage, plans the handover in the right order, then puts agents on shift to do the work — every run, every escalation to a human, live on the very map you drew.',
		isLive: false
	},
	{
		id: 'prospector',
		name: 'The Prospector',
		tagline: 'Finds who your experience says is next',
		description:
			'Learns what your best clients look like from the jobs you have actually done, hunts the open web and company registries for businesses that match, and builds a scored, contactable pipeline — export it to your CRM, or work it right here.',
		isLive: false
	}
];
