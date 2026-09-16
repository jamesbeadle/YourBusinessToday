import { notTheOwner, ownedProject } from '../projectAccess';
import { moveProject } from '$lib/server/projects/moveProject';
import { objectSchema, readText, textField } from '../actionTypes';
import { placeProject } from '$lib/server/projects/placeProject';
import { setProjectPriority } from '$lib/server/projects/setProjectPriority';
import {
	besidePlacementField,
	directionField,
	priorityField,
	readBesidePlacement,
	readMoveDirection,
	readPriority,
	sayWhichDirection,
	sayWhichPlacement,
	sayWhichPriority
} from './orderingFields';
import type { McpAction } from '../actionTypes';

const projectIdField = textField('The project id');

export const projectOrderActions: McpAction[] = [
	{
		name: 'set_project_priority',
		area: 'projects',
		audience: 'everyone',
		isWrite: true,
		summary: 'give a project a priority number on your board — the others shift to make room',
		guidance:
			'The board is in priority order: 1 matters most right now. list_projects shows each ' +
			'project’s number, so read it, then set the number the person wants.',
		inputSchema: objectSchema(
			{ projectId: projectIdField, priority: priorityField('project') },
			['projectId', 'priority']
		),
		run: async (caller, input) => {
			const project = await ownedProject(caller, readText(input, 'projectId'));
			if (project === null) return notTheOwner;
			const priority = readPriority(input);
			if (priority === null) return sayWhichPriority;
			await setProjectPriority(caller.supabase, project.id, priority);
			return `${project.name} is now priority ${priority} on your board.`;
		}
	},
	{
		name: 'move_project',
		area: 'projects',
		audience: 'everyone',
		isWrite: true,
		summary: 'move a project one place up or down its board',
		guidance: 'To give it a particular number in one call, use set_project_priority.',
		inputSchema: objectSchema({ projectId: projectIdField, direction: directionField }, [
			'projectId',
			'direction'
		]),
		run: async (caller, input) => {
			const project = await ownedProject(caller, readText(input, 'projectId'));
			if (project === null) return notTheOwner;
			const direction = readMoveDirection(input);
			if (direction === null) return sayWhichDirection;
			await moveProject(caller.supabase, project.id, direction);
			return `${project.name} moved ${direction}.`;
		}
	},
	{
		name: 'place_project',
		area: 'projects',
		audience: 'everyone',
		isWrite: true,
		summary: 'place a project directly before or after another on the same board',
		inputSchema: objectSchema(
			{
				projectId: projectIdField,
				targetProjectId: textField('The project to place it beside'),
				placement: besidePlacementField
			},
			['projectId', 'targetProjectId', 'placement']
		),
		run: async (caller, input) => {
			const project = await ownedProject(caller, readText(input, 'projectId'));
			const targetProject = await ownedProject(caller, readText(input, 'targetProjectId'));
			if (project === null || targetProject === null) return notTheOwner;
			if (project.ownerId !== targetProject.ownerId) return 'Both projects must be on one board.';
			const placement = readBesidePlacement(input);
			if (placement === null) return sayWhichPlacement;
			await placeProject(caller.supabase, project.id, targetProject.id, placement);
			return `${project.name} now sits ${placement} ${targetProject.name}.`;
		}
	}
];
