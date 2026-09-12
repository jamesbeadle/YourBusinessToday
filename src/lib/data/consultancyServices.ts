export type ConsultancyService = {
	id: string;
	name: string;
	tagline: string;
	description: string;
};

export const consultancyServices: ConsultancyService[] = [
	{
		id: 'client-portal',
		name: 'A portal for the work',
		tagline: 'One place instead of an inbox',
		description:
			'Your team and ours see the same board: every project, every goal, every job in flight. What used to be an email chain becomes a thread on the thing it is about.'
	},
	{
		id: 'automation',
		name: 'The work that repeats',
		tagline: 'Built to run without you',
		description:
			'The chasing, the retyping, the handover that stalls every Friday. We take them one at a time and build the tool that does them, then hand it over working.'
	},
	{
		id: 'connect-your-tools',
		name: 'A connection to Claude',
		tagline: 'Your business, inside your assistant',
		description:
			'An MCP server puts the work inside the assistant you already use. Ask for the state of a job, raise a request, follow the thread — without opening a browser.'
	},
	{
		id: 'knowledge-base',
		name: 'A record of how you work',
		tagline: 'Written down, and yours',
		description:
			'Everything we learn about your business is written down in your own language, not a template — so the next person you hire, and the next tool you buy, can be told it in an afternoon.'
	}
];
