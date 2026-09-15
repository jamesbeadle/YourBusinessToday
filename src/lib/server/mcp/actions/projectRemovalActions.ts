import { deleteProject } from '$lib/server/projects/deleteProject';
import { notTheOwner, ownedProject } from '../projectAccess';
import { objectSchema, readText, textField } from '../actionTypes';
import type { McpAction } from '../actionTypes';

export const projectRemovalActions: McpAction[] = [
	{
		name: 'delete_project',
		area: 'projects',
		audience: 'everyone',
		isWrite: true,
		summary: 'delete a project and everything inside it',
		guidance:
			'This permanently deletes every task and subtask in the project and all their ' +
			'comments, and it cannot be undone. A project that has simply finished should be ' +
			'set to complete instead.',
		inputSchema: objectSchema({ projectId: textField('The project id') }, ['projectId']),
		run: async (caller, input) => {
			const project = await ownedProject(caller, readText(input, 'projectId'));
			if (project === null) return notTheOwner;
			await deleteProject(caller.supabase, project.id);
			return `${project.name} and everything in it is deleted.`;
		}
	}
];
