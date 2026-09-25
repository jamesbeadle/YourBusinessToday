export type ConsultancyDiscipline = {
	id: string;
	name: string;
	description: string;
};

export const consultancyDisciplines: ConsultancyDiscipline[] = [
	{
		id: 'discovery',
		name: 'Mapping your data sources',
		description:
			'Wherever your business creates a record, a document or an asset today, found and written down.'
	},
	{
		id: 'harness',
		name: 'The harness',
		description:
			'One database that holds all of it, every value typed and checked. Usually SQL, always yours.'
	},
	{
		id: 'skills',
		name: 'Skills for the agent',
		description:
			'The complex processes around the harness, written so a Claude or a ChatGPT can run them: harness data in, outputs back into the harness.'
	},
	{
		id: 'dashboards',
		name: 'Dashboards',
		description:
			'Views over the harness, so you can see the business the way any software would show it.'
	},
	{
		id: 'mcp',
		name: 'The MCP server',
		description:
			'The same actions the website performs, reached from inside the agent, with role-based access deciding who may do what.'
	},
	{
		id: 'management',
		name: 'Ongoing management',
		description:
			'We stay on the harness, the skills and the doors we build. Not a handover and a goodbye.'
	}
];
