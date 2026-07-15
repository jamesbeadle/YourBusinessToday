export type EcosystemTool = {
	id: string;
	name: string;
	tagline: string;
	description: string;
	isLive: boolean;
	href?: string;
};

export const ecosystemTools: EcosystemTool[] = [
	{
		id: 'workflow-map',
		name: 'The Workflow Map',
		tagline: 'Captures what your business does',
		description:
			'Talk to an agent about your business and watch it drawn live as a transit map — every role a line, every task a station, every handover an interchange.',
		isLive: true,
		href: '/workspace'
	},
	{
		id: 'second-brain',
		name: 'The Second Brain',
		tagline: 'Captures what your business knows',
		description:
			'Reads everything your company files — clients, suppliers, projects, history — into a living knowledge base that connects to where your documents already live, so you can simply ask and get answers grounded in your own records.',
		isLive: false
	},
	{
		id: 'workforce',
		name: 'The Workforce',
		tagline: 'Runs what your business hands over',
		description:
			'Reads your map to score every task for AI coverage, plans the handover in the right order, then puts agents on shift to do the work — every run, every escalation to a human, live on the very map you drew.',
		isLive: false
	},
	{
		id: 'prospector',
		name: 'The Prospector',
		tagline: 'Finds who your business serves next',
		description:
			'Learns what your best clients look like from your profile, hunts the open web and company registries for businesses that match, and builds a scored, contactable pipeline — export it to your CRM, or work it right here.',
		isLive: false
	}
];
