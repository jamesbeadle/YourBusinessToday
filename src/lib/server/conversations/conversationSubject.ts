export type ConversationSubject = { goalId: string } | { taskId: string };

export function isGoalSubject(subject: ConversationSubject): subject is { goalId: string } {
	return 'goalId' in subject;
}

export function subjectColumns(subject: ConversationSubject): {
	goal_id: string | null;
	task_id: string | null;
} {
	if (isGoalSubject(subject)) return { goal_id: subject.goalId, task_id: null };
	return { goal_id: null, task_id: subject.taskId };
}

export function subjectFilter(subject: ConversationSubject): { column: string; id: string } {
	if (isGoalSubject(subject)) return { column: 'goal_id', id: subject.goalId };
	return { column: 'task_id', id: subject.taskId };
}
