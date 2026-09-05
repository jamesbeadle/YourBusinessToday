import { createProject } from '$lib/server/projects/createProject';
import { deleteProject } from '$lib/server/projects/deleteProject';
import { getProject } from '$lib/server/projects/getProject';
import { noSuchProject } from './describeProject';
import { objectSchema, readOptionalText, readText, textField } from '../actionTypes';
import { projectStatusLabels, projectStatusOrder } from '$lib/data/projectStatus';
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
		audience: 'staff',
		isWrite: true,
		summary: 'start a new project on a staff board',
		inputSchema: objectSchema(
			{
				name: textField('What the project is called'),
				description: textField('What the project is for'),
				ownerStaffMemberId: textField('Whose board it belongs on — defaults to your own')
			},
			['name']
		),
		run: async (caller, input) => {
			const name = readOptionalText(input, 'name');
			if (name === null) return 'A project needs a name. Say what to call it and try again.';
			await createProject(caller.supabase, {
				name,
				description: readText(input, 'description'),
				ownerId: readOptionalText(input, 'ownerStaffMemberId') ?? caller.accountId,
				createdBy: caller.accountId
			});
			return `Project "${name}" created. Call list_projects for its id.`;
		}
	},
	{
		name: 'update_project_details',
		area: 'projects',
		audience: 'staff',
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
			const project = await getProject(caller.supabase, readText(input, 'projectId'));
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
	},
	{
		name: 'delete_project',
		area: 'projects',
		audience: 'staff',
		isWrite: true,
		summary: 'delete a project and everything inside it',
		guidance:
			'This permanently deletes every task and subtask in the project and all their ' +
			'comments, and it cannot be undone. A project that has simply finished should be ' +
			'set to complete instead.',
		inputSchema: objectSchema({ projectId: textField('The project id') }, ['projectId']),
		run: async (caller, input) => {
			const project = await getProject(caller.supabase, readText(input, 'projectId'));
			if (project === null) return noSuchProject;
			await deleteProject(caller.supabase, project.id);
			return `${project.name} and everything in it is deleted.`;
		}
	}
];

function readStatus(input: Record<string, unknown>, project: Project): ProjectStatus | null {
	const status = readOptionalText(input, 'status');
	if (status === null) return project.status;
	if (projectStatusOrder.includes(status as ProjectStatus)) return status as ProjectStatus;
	return null;
}
