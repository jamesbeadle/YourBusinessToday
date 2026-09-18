import { moveTaskToProject } from '$lib/server/projects/moveTaskToProject';
import { noReachableProject, reachableProject, reachableTask } from '../projectAccess';
import { noSuchTask } from './describeTask';
import { objectSchema, readText, textField } from '../actionTypes';
import type { McpAction } from '../actionTypes';

export const taskProjectActions: McpAction[] = [
	{
		name: 'move_task_to_project',
		area: 'tasks',
		audience: 'everyone',
		isWrite: true,
		summary: 'move a task, with everything on it, to another project you are on',
		guidance:
			'Work raised in the wrong place is moved, never deleted and raised again: its messages, ' +
			'acceptance criteria, checklists, attachments and subtasks all travel with it. Two ' +
			'things cannot cross — its goal, because a goal belongs to the project the task was ' +
			'raised on, and anyone assigned who is not on the destination project. A subtask moved ' +
			'on its own comes up to the top level; a parent takes its subtasks with it. The task ' +
			'lands at the end of the destination backlog, keeps its place in the owner’s queue, and ' +
			'the move is written on its own conversation.',
		inputSchema: objectSchema(
			{
				taskId: textField('The task to move'),
				projectId: textField('The project it should move to')
			},
			['taskId', 'projectId']
		),
		run: async (caller, input) => {
			const task = await reachableTask(caller, readText(input, 'taskId'));
			if (task === null) return noSuchTask;
			const destination = await reachableProject(caller, readText(input, 'projectId'));
			if (destination === null) return noReachableProject;
			if (destination.id === task.projectId) {
				return `"${task.title}" is already on ${destination.name}.`;
			}
			const source = await reachableProject(caller, task.projectId);
			if (source === null) return noReachableProject;
			await moveTaskToProject(caller.supabase, {
				task,
				source,
				destination,
				movedByAccountId: caller.accountId
			});
			return `"${task.title}" is now on ${destination.name}, at the end of its backlog.`;
		}
	}
];
