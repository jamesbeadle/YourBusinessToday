export type TeamMember = {
	id: string;
	name: string;
	initials: string;
	role: string;
	contribution: string;
};

export const teamMembers: TeamMember[] = [
	{
		id: 'nigel-reilly',
		name: 'Nigel Reilly',
		initials: 'NR',
		role: 'Managing Partner',
		contribution:
			'Business acumen, connections and a range of industry experience.'
	},
	{
		id: 'jeremy-ferendinos',
		name: 'Jeremy Ferendinos',
		initials: 'JF',
		role: 'Founding Partner',
		contribution: 'Financial knowledge, business knowledge and client connections.'
	},
	{
		id: 'james-beadle',
		name: 'James Beadle',
		initials: 'JB',
		role: 'Founding Partner',
		contribution:
			'Technical and business knowledge, built on systems for large multinational clients and for small and medium enterprises.'
	}
];
