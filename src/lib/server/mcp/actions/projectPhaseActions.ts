import { createPhase } from '$lib/server/projects/createPhase';
import { deletePhase } from '$lib/server/projects/deletePhase';
import { getProject } from '$lib/server/projects/getProject';
import { getProjectPhases } from '$lib/server/projects/getProjectPhases';
import { noSuchProject } from './describeProject';
import { objectSchema, readOptionalText, readText, textField } from '../actionTypes';
import type { McpAction } from '../actionTypes';
import type { Phase } from '$lib/server/projects/phaseRecord';

const projectIdField = textField('The project the phase belongs to');

export const projectPhaseActions: McpAction[] = [
	{
		name: 'add_project_phase',
		area: 'projects',
		audience: 'staff',
		isWrite: true,
		summary: 'add a phase to the end of a project',
		inputSchema: objectSchema(
			{ projectId: projectIdField, name: textField('What the phase is called') },
			['projectId', 'name']
		),
		run: async (caller, input) => {
			const project = await getProject(caller.supabase, readText(input, 'projectId'));
			if (project === null) return noSuchProject;
			const name = readOptionalText(input, 'name');
			if (name === null) return 'A phase needs a name. Say what to call it and try again.';
			await createPhase(caller.supabase, project.id, name);
			return `Phase "${name}" added to ${project.name}.`;
		}
	},
	{
		name: 'remove_project_phase',
		area: 'projects',
		audience: 'staff',
		isWrite: true,
		summary: 'remove a phase from a project',
		guidance: 'The tasks in the phase are kept — they simply stop belonging to a phase.',
		inputSchema: objectSchema(
			{ projectId: projectIdField, phaseId: textField('The phase id') },
			['projectId', 'phaseId']
		),
		run: async (caller, input) => {
			const phases = await getProjectPhases(caller.supabase, readText(input, 'projectId'));
			const phaseId = readText(input, 'phaseId');
			const phase = phases.find((candidate) => candidate.id === phaseId);
			if (phase === undefined) return chooseAnotherPhase(phases);
			await deletePhase(caller.supabase, phase.id);
			return `Phase "${phase.name}" removed. Its tasks are still there.`;
		}
	}
];

function chooseAnotherPhase(phases: Phase[]): string {
	if (phases.length === 0) return 'That project has no phases to remove.';
	const choices = phases.map((phase) => `${phase.name} (id: ${phase.id})`).join(', ');
	return `That project has no phase with that id. Its phases are: ${choices}.`;
}
