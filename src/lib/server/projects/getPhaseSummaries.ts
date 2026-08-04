import { weightedCompletionPercent } from '$lib/data/completionSummary';
import type { Phase } from '$lib/server/projects/phaseRecord';
import type { ProjectTask } from '$lib/server/projects/taskRecord';

export type PhaseSummary = Phase & { completionPercent: number; taskCount: number };

export function getPhaseSummaries(phases: Phase[], tasks: ProjectTask[]): PhaseSummary[] {
	return phases.map((phase) => summarisePhase(phase, tasks));
}

function summarisePhase(phase: Phase, tasks: ProjectTask[]): PhaseSummary {
	const phaseTasks = tasks.filter((task) => task.phaseId === phase.id);
	return {
		...phase,
		completionPercent: weightedCompletionPercent(phaseTasks),
		taskCount: phaseTasks.length
	};
}
