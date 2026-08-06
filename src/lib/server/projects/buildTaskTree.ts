import type { ProjectTask } from '$lib/server/projects/taskRecord';

export type TaskTreeNode = ProjectTask & { subtasks: TaskTreeNode[] };

export function buildTaskTree(tasksOrderedByPriority: ProjectTask[]): TaskTreeNode[] {
	const nodesById = new Map<string, TaskTreeNode>(
		tasksOrderedByPriority.map((task) => [task.id, { ...task, subtasks: [] }])
	);
	const rootNodes: TaskTreeNode[] = [];
	for (const node of nodesById.values()) {
		const parent = node.parentTaskId === null ? undefined : nodesById.get(node.parentTaskId);
		if (parent === undefined) {
			rootNodes.push(node);
			continue;
		}
		parent.subtasks.push(node);
	}
	return rootNodes;
}
