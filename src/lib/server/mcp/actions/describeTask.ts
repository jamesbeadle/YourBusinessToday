import { taskStatusLabels } from '$lib/data/taskStatus';
import type { AcceptanceCriterion } from '$lib/server/projects/criterionRecord';
import type { loadTaskWorkspace } from '$lib/server/projects/loadTaskWorkspace';
import type { ProjectTask } from '$lib/server/projects/taskRecord';
import type { StaffMember } from '$lib/server/projects/getStaffDirectory';
import type { TaskChecklist } from '$lib/server/projects/checklistRecord';
import type { TaskComment } from '$lib/server/projects/getTaskComments';

export type TaskWorkspace = NonNullable<Awaited<ReturnType<typeof loadTaskWorkspace>>>;

export const noSuchTask = 'No task has that id. Call read_task_queue or read_project to find it.';

export function describeTask(workspace: TaskWorkspace): string {
	const task = workspace.task;
	return [
		headline(task),
		`Project: ${workspace.project.name} (id: ${workspace.project.id})`,
		`Phase: ${phaseName(workspace)}. Due: ${task.dueDate ?? 'no date set'}.`,
		teamLine(workspace),
		storyLine(task),
		task.details === '' ? 'No details written yet.' : `Details: ${task.details}`,
		...criterionLines(workspace.criteria),
		...checklistLines(workspace.checklists),
		...commentLines(workspace.comments, workspace.staffMembers)
	].join('\n');
}

function headline(task: ProjectTask): string {
	const status = taskStatusLabels[task.status];
	const progress = `${task.storyPoints} points, ${task.completionPercent}% done`;
	return `${task.title} — ${status}, ${progress} (id: ${task.id})`;
}

function phaseName(workspace: TaskWorkspace): string {
	const phase = workspace.phases.find((candidate) => candidate.id === workspace.task.phaseId);
	if (phase === undefined) return 'none';
	return phase.name;
}

function teamLine(workspace: TaskWorkspace): string {
	const names = workspace.staffMembers
		.filter((staffMember) => workspace.assigneeIds.includes(staffMember.id))
		.map((staffMember) => staffMember.name);
	const assignees = names.length === 0 ? 'nobody' : names.join(', ');
	const roles = workspace.roles.length === 0 ? 'none named' : workspace.roles.join(', ');
	return `Assigned to ${assignees}. Roles: ${roles}.`;
}

function storyLine(task: ProjectTask): string {
	if (!task.isUserStory) return 'This is not written as a user story yet.';
	return `Story: as ${task.storyRole}, I want ${task.storyWant}, so that ${task.storyBenefit}.`;
}

function criterionLines(criteria: AcceptanceCriterion[]): string[] {
	if (criteria.length === 0) return ['Acceptance criteria: none yet.'];
	return ['Acceptance criteria:', ...criteria.map(criterionLine)];
}

function criterionLine(criterion: AcceptanceCriterion): string {
	const state = criterion.isMet ? 'met' : 'not met';
	return `- ${criterion.description} (${state}, id: ${criterion.id})`;
}

function checklistLines(checklists: TaskChecklist[]): string[] {
	return checklists.flatMap((checklist) => [
		`Checklist "${checklist.title}":`,
		...checklist.items.map((item) => `- ${item.description} (${itemState(item.isDone)})`)
	]);
}

function itemState(isDone: boolean): string {
	if (isDone) return 'done';
	return 'to do';
}

function commentLines(comments: TaskComment[], staffMembers: StaffMember[]): string[] {
	if (comments.length === 0) return ['No comments yet.'];
	const nameById = new Map(staffMembers.map((staffMember) => [staffMember.id, staffMember.name]));
	const lines = comments.map(
		(comment) => `${nameById.get(comment.authorId) ?? 'Former staff'}: ${comment.body}`
	);
	return ['Comments:', ...lines];
}
