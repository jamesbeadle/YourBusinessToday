import type { TaskTreeNode } from '$lib/server/projects/buildTaskTree';

export function countTasksInTree(tasks: TaskTreeNode[]): number {
	return tasks.reduce((count, task) => count + 1 + countTasksInTree(task.subtasks), 0);
}
