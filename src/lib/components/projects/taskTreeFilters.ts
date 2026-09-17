import { isTaskDone } from '$lib/data/taskStatus';
import type { TaskTreeNode } from '$lib/server/projects/buildTaskTree';

export function withoutDoneTasks(taskTree: TaskTreeNode[]): TaskTreeNode[] {
	return taskTree
		.filter((task) => !isTaskDone(task.status))
		.map((task) => ({ ...task, subtasks: withoutDoneTasks(task.subtasks) }));
}
