import { projectStatusLabels } from '$lib/data/projectStatus';
import { taskStatusLabels } from '$lib/data/taskStatus';
import type { PhaseSummary } from '$lib/server/projects/getPhaseSummaries';
import type { Project } from '$lib/server/projects/projectRecord';
import type { ProjectSummary } from '$lib/server/projects/getProjectList';
import type { TaskTreeNode } from '$lib/server/projects/buildTaskTree';

export const noSuchProject = 'No project has that id. Call list_projects to see the board.';

const subtaskIndent = '  ';

export function describeProjectLine(project: ProjectSummary): string {
	const status = projectStatusLabels[project.status];
	return `${project.name} — ${status}, ${project.openTaskCount} open (id: ${project.id})`;
}

export function describeProject(
	project: Project,
	phases: PhaseSummary[],
	backlog: TaskTreeNode[]
): string {
	return [
		`${project.name} — ${projectStatusLabels[project.status]} (id: ${project.id})`,
		project.description === '' ? 'No description yet.' : project.description,
		'',
		'Phases:',
		...phaseLines(phases),
		'',
		'Backlog:',
		...backlogLines(backlog)
	].join('\n');
}

function phaseLines(phases: PhaseSummary[]): string[] {
	if (phases.length === 0) return ['None yet.'];
	return phases.map(phaseLine);
}

function phaseLine(phase: PhaseSummary): string {
	return `${phase.name} — ${phase.completionPercent}% of ${phase.taskCount} tasks (id: ${phase.id})`;
}

function backlogLines(tasks: TaskTreeNode[]): string[] {
	if (tasks.length === 0) return ['Nothing in the backlog yet.'];
	return tasks.flatMap((task) => taskLines(task, ''));
}

function taskLines(task: TaskTreeNode, indent: string): string[] {
	return [
		taskLine(task, indent),
		...task.subtasks.flatMap((subtask) => taskLines(subtask, `${indent}${subtaskIndent}`))
	];
}

function taskLine(task: TaskTreeNode, indent: string): string {
	const status = taskStatusLabels[task.status];
	return `${indent}${task.title} — ${status}, ${task.storyPoints} points (id: ${task.id})`;
}
