import { addProjectMember } from '$lib/server/members/addProjectMember';
import { findAccountByEmail } from '$lib/server/accounts/findAccountByEmail';
import { getMemberProjects } from '$lib/server/members/getMemberProjects';
import { getProject } from '$lib/server/projects/getProject';
import { getProjectMembers } from '$lib/server/members/getProjectMembers';
import { noSuchProject } from './describeProject';
import { objectSchema, readText, textField } from '../actionTypes';
import { projectStatusLabels } from '$lib/data/projectStatus';
import { removeProjectMember } from '$lib/server/members/removeProjectMember';
import type { McpAction } from '../actionTypes';

const projectIdField = textField('The project id');
const emailField = textField('The email address the person signs in to Your Business Today with');

export const projectMemberActions: McpAction[] = [
	{
		name: 'list_my_projects',
		area: 'projects',
		audience: 'member',
		isWrite: false,
		summary: 'the projects you have been given access to, with the ids everything else is keyed on',
		inputSchema: objectSchema({}),
		run: async (caller) => {
			const projects = await getMemberProjects(caller.supabase, caller.accountId);
			if (projects.length === 0) return 'You have not been added to a project yet.';
			return projects
				.map((project) => `${project.name} — ${projectStatusLabels[project.status]} (id: ${project.id})`)
				.join('\n');
		}
	},
	{
		name: 'list_project_members',
		area: 'projects',
		audience: 'admin',
		isWrite: false,
		summary: 'who outside staff can reach a project through Claude',
		inputSchema: objectSchema({ projectId: projectIdField }, ['projectId']),
		run: async (caller, input) => {
			const project = await getProject(caller.supabase, readText(input, 'projectId'));
			if (project === null) return noSuchProject;
			const members = await getProjectMembers(caller.supabase, project.id);
			if (members.length === 0) return `Nobody outside staff has been added to ${project.name}.`;
			return members.map((member) => `${member.name} — ${member.email} (account id: ${member.id})`).join('\n');
		}
	},
	{
		name: 'add_project_member',
		area: 'projects',
		audience: 'admin',
		isWrite: true,
		summary: 'give a signed-up person access to one project: its goals, tasks and conversations',
		guidance:
			'Membership is the only way in for anyone who is not staff, so add exactly the people ' +
			'who should see this project. They must already have an account here.',
		inputSchema: objectSchema({ projectId: projectIdField, email: emailField }, ['projectId', 'email']),
		run: async (caller, input) => {
			const project = await getProject(caller.supabase, readText(input, 'projectId'));
			if (project === null) return noSuchProject;
			const account = await findAccountByEmail(caller.supabase, readText(input, 'email'));
			if (account === null) return 'Nobody has signed up with that address. Ask them to create an account first.';
			await addProjectMember(caller.supabase, project.id, account.id, caller.accountId);
			return `${account.name} can now reach ${project.name}.`;
		}
	},
	{
		name: 'remove_project_member',
		area: 'projects',
		audience: 'admin',
		isWrite: true,
		summary: 'take a person off a project',
		inputSchema: objectSchema({ projectId: projectIdField, email: emailField }, ['projectId', 'email']),
		run: async (caller, input) => {
			const project = await getProject(caller.supabase, readText(input, 'projectId'));
			if (project === null) return noSuchProject;
			const account = await findAccountByEmail(caller.supabase, readText(input, 'email'));
			if (account === null) return 'Nobody has an account with that address.';
			await removeProjectMember(caller.supabase, project.id, account.id);
			return `${account.name} can no longer reach ${project.name}.`;
		}
	}
];
