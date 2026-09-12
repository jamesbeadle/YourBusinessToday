export type ConsultancyStep = {
	id: string;
	name: string;
	description: string;
	accentClass: string;
};

export const consultancySteps: ConsultancyStep[] = [
	{
		id: 'learn',
		name: 'We learn how it really runs',
		description:
			'We interview the people who do the work and read the documents you already have. Not how the business is supposed to run — how it actually does, on a bad week.',
		accentClass: 'bg-signal'
	},
	{
		id: 'automate',
		name: 'We automate the work that repeats',
		description:
			'The chasing, the retyping, the handovers that stall. We pick the work that repeats and build the tools that take it on, one request at a time.',
		accentClass: 'bg-go'
	},
	{
		id: 'keep',
		name: 'You end up running on it',
		description:
			'A business that runs with less of you in it. The tools are yours, the record of how you work is yours, and we are not a dependency you cannot leave.',
		accentClass: 'bg-caution'
	}
];
