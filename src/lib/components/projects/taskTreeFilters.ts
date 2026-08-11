import type { TaskTreeNode } from '$lib/server/projects/buildTaskTree';

export function tasksInPhase(taskTree: TaskTreeNode[], selectedPhaseId: string): TaskTreeNode[] {
	return taskTree.filter((task) => isInSelectedPhase(task.phaseId, selectedPhaseId));
}

export function withoutDoneTasks(taskTree: TaskTreeNode[]): TaskTreeNode[] {
	return taskTree
		.filter((task) => task.status !== 'done')
		.map((task) => ({ ...task, subtasks: withoutDoneTasks(task.subtasks) }));
}

function isInSelectedPhase(phaseId: string | null, selectedPhaseId: string): boolean {
	if (selectedPhaseId === 'all') return true;
	if (selectedPhaseId === 'none') return phaseId === null;
	return phaseId === selectedPhaseId;
}
