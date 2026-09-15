import { createProject } from '$lib/server/projects/createProject';
import { noSuchProject } from './describeProject';
import { objectSchema, readOptionalText, readText, textField } from '../actionTypes';
import { projectStatusLabels, projectStatusOrder } from '$lib/data/projectStatus';
import { reachableProject } from '../projectAccess';
import { updateProjectDetails } from '$lib/server/projects/updateProjectDetails';
import type { McpAction } from '../actionTypes';
import type { Project } from '$lib/server/projects/projectRecord';
import type { ProjectStatus } from '$lib/data/projectStatus';

const everyStatus = projectStatusOrder.join(', ');

const statusField = textField(`One of ${everyStatus}`);

const wrongStatus = `A project is ${everyStatus}. Pick one of those.`;

export const projectWriteActions: McpAction[] = [
	{
		name: 'create_project',
		area: 'projects',
		audience: 'everyone',
		isWrite: true,
		summary: 'start a new project that you own',
		guidance:
			'You own it and can hand it on; everyone you bring on to it manages it with you. It lands ' +
			'at the bottom of your board; call move_project or place_project to prioritise it.',
		inputSchema: objectSchema(
			{
				name: textField('What the project is called'),
				description: textField('What the project is for')
			},
			['name']
		),
		run: async (caller, input) => {
			const name = readOptionalText(input, 'name');
			if (name === null) return 'A project needs a name. Say what to call it and try again.';
			await createProject(caller.supabase, {
				name,
				description: readText(input, 'description'),
				ownerId: caller.accountId,
				createdBy: caller.accountId
			});
			return `Project "${name}" created. Call list_projects for its id.`;
		}
	},
	{
		name: 'update_project_details',
		area: 'projects',
		audience: 'everyone',
		isWrite: true,
		summary: 'rename a project, rewrite its description or change its status',
		inputSchema: objectSchema(
			{
				projectId: textField('The project id'),
				name: textField('A new name — leave out to keep the current one'),
				description: textField('A new description — leave out to keep the current one'),
				status: statusField
			},
			['projectId']
		),
		run: async (caller, input) => {
			const project = await reachableProject(caller, readText(input, 'projectId'));
			if (project === null) return noSuchProject;
			const status = readStatus(input, project);
			if (status === null) return wrongStatus;
			const name = readOptionalText(input, 'name') ?? project.name;
			await updateProjectDetails(caller.supabase, project.id, {
				name,
				description: readOptionalText(input, 'description') ?? project.description,
				status
			});
			return `${name} saved — ${projectStatusLabels[status]}.`;
		}
	}
];

function readStatus(input: Record<string, unknown>, project: Project): ProjectStatus | null {
	const status = readOptionalText(input, 'status');
	if (status === null) return project.status;
	if (projectStatusOrder.includes(status as ProjectStatus)) return status as ProjectStatus;
	return null;
}
