import { addTaskComment } from '$lib/server/projects/addTaskComment';
import { getStaffDirectory } from '$lib/server/projects/getStaffDirectory';
import { getTask } from '$lib/server/projects/getTask';
import { noSuchTask } from './describeTask';
import { objectSchema, readOptionalText, readText, textField } from '../actionTypes';
import { setTaskAssignees } from '$lib/server/projects/setTaskAssignees';
import type { McpAction } from '../actionTypes';
import type { StaffMember } from '$lib/server/projects/getStaffDirectory';

const taskIdField = textField('The task id');
const nameEveryoneAsAList =
	'Pass staffMemberIds as a list of ids — an empty list to unassign everyone.';

export const taskTeamActions: McpAction[] = [
	{
		name: 'set_task_assignees',
		area: 'tasks',
		audience: 'staff',
		isWrite: true,
		summary: 'say which staff members are working on a task',
		guidance:
			'This replaces the whole list, so name everyone who should be on the task, not ' +
			'only the person joining. An empty list leaves the task unassigned.',
		inputSchema: objectSchema(
			{
				taskId: taskIdField,
				staffMemberIds: {
					type: 'array',
					items: { type: 'string' },
					description: 'Everyone who should be on the task'
				}
			},
			['taskId', 'staffMemberIds']
		),
		run: async (caller, input) => {
			const task = await getTask(caller.supabase, readText(input, 'taskId'));
			if (task === null) return noSuchTask;
			const staffMembers = await getStaffDirectory(caller.supabase);
			const chosenIds = readStaffMemberIds(input);
			if (chosenIds === null) return nameEveryoneAsAList;
			const chosen = staffMembers.filter((member) => chosenIds.includes(member.id));
			if (chosen.length !== chosenIds.length) return chooseFromDirectory(staffMembers);
			await setTaskAssignees(caller.supabase, task.id, chosenIds);
			return `"${task.title}" is now with ${namesOf(chosen)}.`;
		}
	},
	{
		name: 'add_task_comment',
		area: 'tasks',
		audience: 'staff',
		isWrite: true,
		summary: 'leave a comment on a task under your own name',
		inputSchema: objectSchema(
			{ taskId: taskIdField, body: textField('What you want to say') },
			['taskId', 'body']
		),
		run: async (caller, input) => {
			const task = await getTask(caller.supabase, readText(input, 'taskId'));
			if (task === null) return noSuchTask;
			const body = readOptionalText(input, 'body');
			if (body === null) return 'A comment needs some words in it.';
			await addTaskComment(caller.supabase, task.id, caller.accountId, body);
			return `Comment left on "${task.title}".`;
		}
	}
];

function readStaffMemberIds(input: Record<string, unknown>): string[] | null {
	const chosenIds = input.staffMemberIds;
	if (!Array.isArray(chosenIds)) return null;
	return [...new Set(chosenIds.map(String))];
}

function namesOf(staffMembers: StaffMember[]): string {
	if (staffMembers.length === 0) return 'nobody';
	return staffMembers.map((staffMember) => staffMember.name).join(', ');
}

function chooseFromDirectory(staffMembers: StaffMember[]): string {
	const choices = staffMembers
		.map((staffMember) => `${staffMember.name} (id: ${staffMember.id})`)
		.join(', ');
	return `Not everyone you named is on staff. The people you can assign are: ${choices}.`;
}
