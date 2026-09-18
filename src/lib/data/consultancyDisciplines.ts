export type ConsultancyDiscipline = {
	id: string;
	name: string;
	description: string;
};

export const consultancyDisciplines: ConsultancyDiscipline[] = [
	{
		id: 'discovery',
		name: 'Discovery and process mapping',
		description:
			'We find out how the business really runs and write it down in your own language.'
	},
	{
		id: 'software',
		name: 'Bespoke software',
		description:
			'Built around the work you already do, rather than a product you have to adopt first.'
	},
	{
		id: 'automation',
		name: 'AI and automation',
		description:
			'Applied where it takes real work off real people, and nowhere that it does not.'
	},
	{
		id: 'record',
		name: 'The record of your business',
		description:
			'Your expertise, your jobs and your process, kept so they outlive the people holding them.'
	},
	{
		id: 'management',
		name: 'Ongoing management',
		description:
			'We stay on the tools we build and the work they touch. Not a handover and a goodbye.'
	}
];
