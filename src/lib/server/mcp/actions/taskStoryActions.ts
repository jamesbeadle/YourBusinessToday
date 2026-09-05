import { getTask } from '$lib/server/projects/getTask';
import { noSuchTask } from './describeTask';
import { objectSchema, readText, textField } from '../actionTypes';
import { setTaskUserStory } from '$lib/server/projects/setTaskUserStory';
import type { McpAction } from '../actionTypes';

export const taskStoryActions: McpAction[] = [
	{
		name: 'set_task_user_story',
		area: 'tasks',
		audience: 'staff',
		isWrite: true,
		summary: 'write the user story a task delivers, and mark the task as one',
		guidance:
			'A story reads as X user, I want Y feature, for Z benefit — so give each part on ' +
			'its own, with no scaffolding words. A task promoted from a client request already ' +
			'carries the words the client used: read it first and leave those words alone.',
		inputSchema: objectSchema(
			{
				taskId: textField('The task id'),
				role: textField('Who the user is, such as a client at Acme'),
				want: textField('What they want'),
				benefit: textField('Why it is worth having')
			},
			['taskId', 'role', 'want', 'benefit']
		),
		run: async (caller, input) => {
			const task = await getTask(caller.supabase, readText(input, 'taskId'));
			if (task === null) return noSuchTask;
			const story = {
				role: readText(input, 'role'),
				want: readText(input, 'want'),
				benefit: readText(input, 'benefit')
			};
			if (isAnyPartMissing(story)) return 'A story needs a role, a want and a benefit.';
			await setTaskUserStory(caller.supabase, task.id, story);
			const sentence = `as ${story.role}, I want ${story.want}, so that ${story.benefit}`;
			return `"${task.title}" now reads: ${sentence}.`;
		}
	}
];

function isAnyPartMissing(story: { role: string; want: string; benefit: string }): boolean {
	return story.role === '' || story.want === '' || story.benefit === '';
}
