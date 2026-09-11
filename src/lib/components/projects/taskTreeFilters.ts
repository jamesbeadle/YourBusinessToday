import type { TaskTreeNode } from '$lib/server/projects/buildTaskTree';

export function withoutDoneTasks(taskTree: TaskTreeNode[]): TaskTreeNode[] {
	return taskTree
		.filter((task) => task.status !== 'done')
		.map((task) => ({ ...task, subtasks: withoutDoneTasks(task.subtasks) }));
}
