import type { TaskTreeNode } from '$lib/server/projects/buildTaskTree';

export type TaskRowActions = {
	assigneeNamesFor: (taskId: string) => string[];
	goalTitleFor: (goalId: string | null) => string | null;
	onAddSubtask: (parentTask: TaskTreeNode) => void;
	onChangeStatus: (task: TaskTreeNode) => void;
	onChangeGoal: (task: TaskTreeNode) => void;
};
