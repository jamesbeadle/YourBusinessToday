export type TeamMember = {
	id: string;
	name: string;
	initials: string;
	role: string;
	biography: string;
};

export const teamMembers: TeamMember[] = [
	{
		id: 'nigel-reilly',
		name: 'Nigel Reilly',
		initials: 'NR',
		role: 'Managing Partner',
		biography:
			'Sets the direction of the practice. Commercial judgement earned across a range of industries, and the connections that come with a career spent in them.'
	},
	{
		id: 'jeremy-ferendinos',
		name: 'Jeremy Ferendinos',
		initials: 'JF',
		role: 'Founding Partner',
		biography:
			'Covers the financial and commercial side. He reads a business on paper as well as he reads it on the floor, and brings client relationships of his own.'
	},
	{
		id: 'james-beadle',
		name: 'James Beadle',
		initials: 'JB',
		role: 'Founding Partner',
		biography:
			'Builds the systems. He has worked on them for large multinational clients and for small and medium businesses, and knows how differently the two have to be handled.'
	}
];
