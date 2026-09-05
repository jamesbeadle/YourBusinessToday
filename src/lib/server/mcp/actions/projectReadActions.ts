import { buildTaskTree } from '$lib/server/projects/buildTaskTree';
import { describeProject, describeProjectLine, noSuchProject } from './describeProject';
import { getPhaseSummaries } from '$lib/server/projects/getPhaseSummaries';
import { getProject } from '$lib/server/projects/getProject';
import { getProjectList } from '$lib/server/projects/getProjectList';
import { getProjectPhases } from '$lib/server/projects/getProjectPhases';
import { getProjectTasks } from '$lib/server/projects/getProjectTasks';
import { getStaffDirectory } from '$lib/server/projects/getStaffDirectory';
import { objectSchema, readOptionalText, readText, textField } from '../actionTypes';
import { resolveViewedStaffMember } from '$lib/server/projects/resolveViewedStaffMember';
import type { McpAction } from '../actionTypes';

export const projectReadActions: McpAction[] = [
	{
		name: 'list_projects',
		area: 'projects',
		audience: 'staff',
		isWrite: false,
		summary: 'list the projects on a staff board with their open task counts',
		inputSchema: objectSchema({
			staffMemberId: textField('Whose board to read — defaults to your own')
		}),
		run: async (caller, input) => {
			const staffMembers = await getStaffDirectory(caller.supabase);
			const staffMember = resolveViewedStaffMember(
				readOptionalText(input, 'staffMemberId'),
				staffMembers,
				caller.accountId
			);
			const projects = await getProjectList(caller.supabase, staffMember.id);
			if (projects.length === 0) return `${staffMember.name} has no projects.`;
			const lines = projects.map(describeProjectLine);
			return [`Projects for ${staffMember.name}:`, ...lines].join('\n');
		}
	},
	{
		name: 'read_project',
		area: 'projects',
		audience: 'staff',
		isWrite: false,
		summary: 'read one project with its phases and its whole backlog',
		inputSchema: objectSchema({ projectId: textField('The project id') }, ['projectId']),
		run: async (caller, input) => {
			const projectId = readText(input, 'projectId');
			const project = await getProject(caller.supabase, projectId);
			if (project === null) return noSuchProject;
			const tasks = await getProjectTasks(caller.supabase, projectId);
			const phases = await getProjectPhases(caller.supabase, projectId);
			return describeProject(project, getPhaseSummaries(phases, tasks), buildTaskTree(tasks));
		}
	}
];
