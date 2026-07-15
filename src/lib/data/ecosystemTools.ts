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
		tagline: 'See how your business really runs',
		description:
			'Talk to an agent about your business and watch it drawn live as a transit map — every role a line, every task a station, every handover an interchange.',
		isLive: true,
		href: '/workspace'
	},
	{
		id: 'autopilot',
		name: 'The Autopilot',
		tagline: 'See which parts of your business can run themselves',
		description:
			'Reads your map and scores every task for AI coverage — what can run itself today, what needs a copilot, what stays human — with the tools that could take each one on, and the order to hand them over.',
		isLive: false
	},
	{
		id: 'workforce',
		name: 'The Workforce',
		tagline: 'Your AI staff, on shift around the clock',
		description:
			'The agents from your transition plan, doing real jobs and reporting in — every run, every escalation to a human, live on the very map you drew.',
		isLive: false
	},
	{
		id: 'prospector',
		name: 'The Prospector',
		tagline: 'New clients, found while you work',
		description:
			'Learns what your best clients look like from your profile, hunts the open web and company registries for businesses that match, and builds a scored, contactable pipeline — export it to your CRM, or work it right here.',
		isLive: false
	}
];
