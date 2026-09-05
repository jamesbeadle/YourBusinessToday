import { assignProjectToClient } from '$lib/server/projects/assignProjectToClient';
import { getClient } from '$lib/server/clients/getClient';
import { getProject } from '$lib/server/projects/getProject';
import { getUnassignedProjects } from '$lib/server/projects/getUnassignedProjects';
import { objectSchema, readOptionalText, readText, textField } from '../actionTypes';
import type { Client } from '$lib/server/clients/clientRecord';
import type { McpAction } from '../actionTypes';
import type { SupabaseClient } from '@supabase/supabase-js';

export const projectOwnershipActions: McpAction[] = [
	{
		name: 'set_project_client',
		area: 'projects',
		audience: 'staff',
		isWrite: true,
		summary: 'say which client a project is built for, and where its code and site live',
		guidance:
			'The repository and live URL are written exactly as given, so send both every ' +
			'time — whatever you leave out is cleared. Leaving the client out hands the ' +
			'project back to the unassigned list.',
		inputSchema: objectSchema(
			{
				projectId: textField('The project id'),
				clientId: textField('The client id — leave out to unassign the project'),
				repositoryUrl: textField('Where the code lives'),
				environmentUrl: textField('Where the live site is')
			},
			['projectId']
		),
		run: async (caller, input) => {
			const project = await getProject(caller.supabase, readText(input, 'projectId'));
			if (project === null) return await offerUnassignedProjects(caller.supabase);
			const clientId = readOptionalText(input, 'clientId');
			const client = clientId === null ? null : await getClient(caller.supabase, clientId);
			if (clientId !== null && client === null) {
				return 'No client has that id. Look in the clients area for the right one.';
			}
			await assignProjectToClient(
				caller.supabase,
				project.id,
				{
					clientId,
					repositoryUrl: readText(input, 'repositoryUrl'),
					environmentUrl: readText(input, 'environmentUrl')
				},
				caller.accountId
			);
			return `${project.name} ${ownershipSentence(client)}`;
		}
	}
];

function ownershipSentence(client: Client | null): string {
	if (client === null) return 'no longer belongs to a client.';
	return `is now built for ${client.name}.`;
}

async function offerUnassignedProjects(supabase: SupabaseClient): Promise<string> {
	const projects = await getUnassignedProjects(supabase);
	if (projects.length === 0) return 'No project has that id, and every project has a client.';
	const choices = projects.map((project) => `${project.name} (id: ${project.id})`).join(', ');
	return `No project has that id. Projects still without a client: ${choices}.`;
}
