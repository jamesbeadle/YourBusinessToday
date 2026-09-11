import { goalLine } from './describeGoal';
import { projectStatusLabels } from '$lib/data/projectStatus';
import { taskKindLabels, taskStatusLabelFor } from '$lib/data/taskKind';
import type { Goal } from '$lib/server/goals/goalRecord';
import type { Project } from '$lib/server/projects/projectRecord';
import type { ProjectSummary } from '$lib/server/projects/getProjectList';
import type { TaskTreeNode } from '$lib/server/projects/buildTaskTree';

export const noSuchProject = 'No project has that id. Call list_projects to see the board.';

const subtaskIndent = '  ';

export function describeProjectLine(project: ProjectSummary): string {
	const status = projectStatusLabels[project.status];
	return `${project.name} — ${status}, ${project.openTaskCount} open (id: ${project.id})`;
}

export function describeProject(project: Project, goals: Goal[], backlog: TaskTreeNode[]): string {
	return [
		`${project.name} — ${projectStatusLabels[project.status]} (id: ${project.id})`,
		project.description === '' ? 'No description yet.' : project.description,
		'',
		'Goals:',
		...goalLines(goals),
		'',
		'Backlog:',
		...backlogLines(backlog, goals)
	].join('\n');
}

function goalLines(goals: Goal[]): string[] {
	if (goals.length === 0) return ['None yet.'];
	return goals.map(goalLine);
}

function backlogLines(tasks: TaskTreeNode[], goals: Goal[]): string[] {
	if (tasks.length === 0) return ['Nothing in the backlog yet.'];
	return tasks.flatMap((task) => taskLines(task, '', goals));
}

function taskLines(task: TaskTreeNode, indent: string, goals: Goal[]): string[] {
	return [
		taskLine(task, indent, goals),
		...task.subtasks.flatMap((subtask) => taskLines(subtask, `${indent}${subtaskIndent}`, goals))
	];
}

function taskLine(task: TaskTreeNode, indent: string, goals: Goal[]): string {
	const status = taskStatusLabelFor(task.kind, task.status);
	const goal = goals.find((candidate) => candidate.id === task.goalId);
	const underGoal = goal === undefined ? '' : `, under "${goal.title}"`;
	return `${indent}${task.title} — ${taskKindLabels[task.kind]} task, ${status}, ${task.storyPoints} points${underGoal} (id: ${task.id})`;
}
