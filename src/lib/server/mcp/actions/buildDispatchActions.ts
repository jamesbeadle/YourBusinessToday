import { getProject } from '$lib/server/projects/getProject';
import { getTask } from '$lib/server/projects/getTask';
import { noSuchTask } from './describeTask';
import { objectSchema, readText, textField } from '../actionTypes';
import { reviseBuildBrief } from '$lib/server/builder/reviseBuildBrief';
import { sendTaskToBuild } from '$lib/server/builder/sendTaskToBuild';
import type { McpAction } from '../actionTypes';

export const buildDispatchActions: McpAction[] = [
	{
		name: 'revise_build_brief',
		area: 'tasks',
		audience: 'staff',
		isWrite: true,
		summary: 'rewrite the brief the Builder will work from',
		guidance: 'Your words, not the client’s. Locked while a build is queued or running.',
		inputSchema: objectSchema(
			{ taskId: textField('The task id'), brief: textField('The brief, in full') },
			['taskId', 'brief']
		),
		run: async (caller, input) => {
			const task = await getTask(caller.supabase, readText(input, 'taskId'));
			if (task === null) return noSuchTask;
			const revision = await reviseBuildBrief(caller.supabase, task, readText(input, 'brief'));
			if (revision === 'empty') return 'Write the brief first.';
			if (revision === 'building') return 'The brief is locked while a build is running.';
			return `Brief saved on "${task.title}".`;
		}
	},
	{
		name: 'send_task_to_build',
		area: 'tasks',
		audience: 'staff',
		isWrite: true,
		summary: 'send a task to the Builder for its size; story points choose the tier',
		guidance:
			'Needs a project with a repository and a brief on the task. 1 to 3 points go to the ' +
			'easy Builder, 5 to 8 to medium, 13 and above to hard. Answers with the run URL.',
		inputSchema: objectSchema({ taskId: textField('The task id') }, ['taskId']),
		run: async (caller, input) => {
			const task = await getTask(caller.supabase, readText(input, 'taskId'));
			if (task === null) return noSuchTask;
			const project = await getProject(caller.supabase, task.projectId);
			if (project === null) return noSuchTask;
			const outcome = await sendTaskToBuild(caller.supabase, task, project, caller.accountId);
			if (outcome.kind === 'refused') return outcome.sentence;
			return `"${task.title}" is queued. Watch the run at ${outcome.sessionUrl}`;
		}
	}
];
