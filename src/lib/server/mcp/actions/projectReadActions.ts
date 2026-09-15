import { buildTaskTree } from '$lib/server/projects/buildTaskTree';
import { describeProject, describeProjectLine, noSuchProject } from './describeProject';
import { getProjectGoals } from '$lib/server/goals/getProjectGoals';
import { getProjectList } from '$lib/server/projects/getProjectList';
import { getProjectTasks } from '$lib/server/projects/getProjectTasks';
import { getTeamProjects, type TeamProject } from '$lib/server/members/getTeamProjects';
import { objectSchema, readText, textField } from '../actionTypes';
import { projectStatusLabels } from '$lib/data/projectStatus';
import { reachableProject } from '../projectAccess';
import type { McpAction } from '../actionTypes';

export const projectReadActions: McpAction[] = [
	{
		name: 'list_projects',
		area: 'projects',
		audience: 'everyone',
		isWrite: false,
		summary:
			'the projects you own, in priority order, then the projects you are on as a team member',
		inputSchema: objectSchema({}),
		run: async (caller) => {
			const owned = await getProjectList(caller.supabase, caller.accountId);
			const team = await getTeamProjects(caller.supabase, caller.accountId);
			if (owned.length === 0 && team.length === 0) {
				return 'You have no projects yet. Call create_project to start one.';
			}
			return [
				'Your projects:',
				...(owned.length === 0 ? ['None yet.'] : owned.map(describeProjectLine)),
				'',
				'Team projects:',
				...(team.length === 0 ? ['None yet.'] : team.map(teamProjectLine))
			].join('\n');
		}
	},
	{
		name: 'read_project',
		area: 'projects',
		audience: 'everyone',
		isWrite: false,
		summary: 'read one project with its goals and its whole backlog',
		inputSchema: objectSchema({ projectId: textField('The project id') }, ['projectId']),
		run: async (caller, input) => {
			const project = await reachableProject(caller, readText(input, 'projectId'));
			if (project === null) return noSuchProject;
			const tasks = await getProjectTasks(caller.supabase, project.id);
			const goals = await getProjectGoals(caller.supabase, project.id);
			return describeProject(project, goals, buildTaskTree(tasks));
		}
	}
];

function teamProjectLine(project: TeamProject): string {
	const status = projectStatusLabels[project.status];
	return `${project.name} — ${status}, ${project.openTaskCount} open, owned by ${project.ownerName} (id: ${project.id})`;
}
