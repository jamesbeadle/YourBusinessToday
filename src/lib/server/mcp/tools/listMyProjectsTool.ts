import { getClientProjects } from '$lib/server/clients/getClientProjects';
import type { McpTool } from '../mcpTools';

export const listMyProjectsTool: McpTool = {
	name: 'list_my_projects',
	title: 'List your projects',
	description:
		'List the projects Your Business Today builds and runs for your company. Use this ' +
		'first: raising a feature request needs one of these project ids.',
	inputSchema: { type: 'object', properties: {}, additionalProperties: false },
	run: async (caller) => {
		const projects = await getClientProjects(caller.supabase, caller.contact.clientId);
		if (projects.length === 0) return 'No projects are recorded for your company yet.';
		return projects.map(describeProject).join('\n');
	}
};

function describeProject(project: {
	id: string;
	name: string;
	repositoryUrl: string;
	openRequestCount: number;
}): string {
	const awaiting =
		project.openRequestCount === 0
			? 'no open requests'
			: `${project.openRequestCount} request(s) awaiting triage`;
	return `${project.name} — id ${project.id} — ${awaiting}${repositoryNote(project.repositoryUrl)}`;
}

function repositoryNote(repositoryUrl: string): string {
	if (repositoryUrl === '') return '';
	return ` — ${repositoryUrl}`;
}
