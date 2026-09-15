import { notTheOwner, ownedProject } from '../projectAccess';
import { moveProject } from '$lib/server/projects/moveProject';
import { objectSchema, readText, textField } from '../actionTypes';
import { placeProject } from '$lib/server/projects/placeProject';
import {
	besidePlacementField,
	directionField,
	readBesidePlacement,
	readMoveDirection,
	sayWhichDirection,
	sayWhichPlacement
} from './orderingFields';
import type { McpAction } from '../actionTypes';

const projectIdField = textField('The project id');

export const projectOrderActions: McpAction[] = [
	{
		name: 'move_project',
		area: 'projects',
		audience: 'everyone',
		isWrite: true,
		summary: 'move a project one place up or down its board',
		guidance: 'The board is in priority order: the top project matters most right now.',
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
