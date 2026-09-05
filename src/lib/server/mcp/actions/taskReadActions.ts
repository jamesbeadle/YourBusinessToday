import { describeTask, noSuchTask } from './describeTask';
import { getGlobalTaskPage } from '$lib/server/projects/getGlobalTaskPage';
import { getStaffDirectory } from '$lib/server/projects/getStaffDirectory';
import { getTask } from '$lib/server/projects/getTask';
import { loadTaskWorkspace } from '$lib/server/projects/loadTaskWorkspace';
import { objectSchema, readOptionalText, readText, textField } from '../actionTypes';
import { resolveViewedStaffMember } from '$lib/server/projects/resolveViewedStaffMember';
import { taskStatusLabels } from '$lib/data/taskStatus';
import type { GlobalTask, GlobalTaskPage } from '$lib/server/projects/getGlobalTaskPage';
import type { McpAction } from '../actionTypes';

const firstPageNumber = 1;

export const taskReadActions: McpAction[] = [
	{
		name: 'read_task_queue',
		area: 'tasks',
		audience: 'staff',
		isWrite: false,
		summary: 'read a staff queue of top level tasks in the order they will be worked',
		inputSchema: objectSchema({
			staffMemberId: textField('Whose queue to read — defaults to your own'),
			pageNumber: { type: 'number', description: 'Which page of twenty, from 1' },
			shouldIncludeDone: { type: 'boolean', description: 'Include tasks already done' }
		}),
		run: async (caller, input) => {
			const staffMembers = await getStaffDirectory(caller.supabase);
			const staffMember = resolveViewedStaffMember(
				readOptionalText(input, 'staffMemberId'),
				staffMembers,
				caller.accountId
			);
			const taskPage = await getGlobalTaskPage(
				caller.supabase,
				staffMember.id,
				readPageNumber(input.pageNumber),
				input.shouldIncludeDone === true
			);
			if (taskPage.taskCount === 0) return `${staffMember.name} has nothing queued.`;
			return describeQueue(staffMember.name, taskPage);
		}
	},
	{
		name: 'read_task',
		area: 'tasks',
		audience: 'staff',
		isWrite: false,
		summary:
			'read one task in full with its story, team, criteria, checklists, attachments and comments',
		inputSchema: objectSchema({ taskId: textField('The task id') }, ['taskId']),
		run: async (caller, input) => {
			const task = await getTask(caller.supabase, readText(input, 'taskId'));
			if (task === null) return noSuchTask;
			const workspace = await loadTaskWorkspace(caller.supabase, task.projectId, task.id);
			if (workspace === null) return noSuchTask;
			return describeTask(workspace);
		}
	}
];

function describeQueue(staffMemberName: string, taskPage: GlobalTaskPage): string {
	const place = `page ${taskPage.pageNumber} of ${taskPage.pageCount}`;
	const heading = `Queue for ${staffMemberName} — ${place}, ${taskPage.taskCount} tasks`;
	const lines = taskPage.tasks.map((task, index) =>
		queueLine(task, taskPage.firstTaskNumber + index)
	);
	return [heading, ...lines].join('\n');
}

function queueLine(task: GlobalTask, position: number): string {
	const status = taskStatusLabels[task.status];
	return `${position}. ${task.title} — ${status}, ${task.projectName} (id: ${task.id})`;
}

function readPageNumber(value: unknown): number {
	const pageNumber = Number(value);
	if (!Number.isInteger(pageNumber) || pageNumber < firstPageNumber) return firstPageNumber;
	return pageNumber;
}
