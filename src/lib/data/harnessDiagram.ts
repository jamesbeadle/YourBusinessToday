export type HarnessTable = {
	name: string;
	columns: string[];
};

export type HarnessDoor = {
	id: string;
	name: string;
	description: string;
};

export const creationFileExamples: string[] = [
	'Quote spreadsheet',
	'Job sheet in Word',
	'Site photographs',
	'Emails agreeing a change',
	'Invoice template',
	'Timesheets'
];

export const harnessTables: HarnessTable[] = [
	{ name: 'projects', columns: ['client', 'address', 'stage'] },
	{ name: 'jobs', columns: ['project', 'trade', 'agreed_price'] },
	{ name: 'invoices', columns: ['job', 'amount', 'due_on'] },
	{ name: 'documents', columns: ['project', 'kind', 'received_on'] }
];

export const agentSkillExamples: string[] = [
	'Assemble the monthly valuation',
	'Write the client report from the week on site',
	'Chase the invoices that are late',
	'Triage what arrived this morning'
];

export const harnessDoors: HarnessDoor[] = [
	{
		id: 'dashboards',
		name: 'Dashboards',
		description: 'A screen for each table and a view for each question, like any software.'
	},
	{
		id: 'mcp',
		name: 'MCP server',
		description: 'The same actions as the screens, performed from inside Claude or ChatGPT.'
	}
];

export const roleBasedAccessLine =
	'One set of roles on both doors. What a person may see or do on the screen is exactly what their agent may see or do.';
