const branchPrefix = 'claude/task-';
const uuidLength = 36;
const longestSlugLength = 40;

export function buildBranchNameFor(taskId: string, title: string): string {
	const slug = title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
		.slice(0, longestSlugLength);
	if (slug === '') return `${branchPrefix}${taskId}`;
	return `${branchPrefix}${taskId}-${slug}`;
}

export function taskIdFromBranchName(branchName: string): string | null {
	if (!branchName.startsWith(branchPrefix)) return null;
	const taskId = branchName.slice(branchPrefix.length, branchPrefix.length + uuidLength);
	if (taskId.length !== uuidLength) return null;
	return taskId;
}
