import { createTask } from '$lib/server/projects/createTask';
import { fibonacciStoryPoints } from '$lib/data/storyPoints';
import { getProject } from '$lib/server/projects/getProject';
import { getTask } from '$lib/server/projects/getTask';
import { noSuchProject } from './describeProject';
import { noSuchTask } from './describeTask';
import { objectSchema, readOptionalText, readText, textField } from '../actionTypes';
import { readTaskDetailsEdit, wrongStoryPoints } from './taskDetailsEdit';
import { updateTaskDetails } from '$lib/server/projects/updateTaskDetails';
import type { McpAction } from '../actionTypes';

const taskIdField = textField('The task id');

const keepText = ' — leave out to keep what is there';

const storyPointsField = {
	type: 'number',
	description: `One of ${fibonacciStoryPoints.join(', ')}`
};

export const taskWriteActions: McpAction[] = [
	{
		name: 'create_task',
		area: 'tasks',
		audience: 'staff',
		isWrite: true,
		summary: 'add a task to a project, at the end of the backlog',
		inputSchema: objectSchema(
			{
				projectId: textField('The project the task belongs to'),
				title: textField('What the task is called'),
				details: textField('What the task involves'),
				dueDate: textField('When it is due, as YYYY-MM-DD'),
				phaseId: textField('The phase it sits in'),
				parentTaskId: textField('The task it is a subtask of')
			},
			['projectId', 'title']
		),
		run: async (caller, input) => {
			const project = await getProject(caller.supabase, readText(input, 'projectId'));
			if (project === null) return noSuchProject;
			const title = readOptionalText(input, 'title');
			if (title === null) return 'A task needs a title. Say what to call it and try again.';
			const taskId = await createTask(
				caller.supabase,
				project.id,
				{
					title,
					details: readText(input, 'details'),
					dueDate: readOptionalText(input, 'dueDate'),
					phaseId: readOptionalText(input, 'phaseId'),
					parentTaskId: readOptionalText(input, 'parentTaskId')
				},
				caller.accountId
			);
			return `"${title}" added to ${project.name} (task id: ${taskId}).`;
		}
	},
	{
		name: 'update_task_details',
		area: 'tasks',
		audience: 'staff',
		isWrite: true,
		summary: 'change a task title, details, due date, phase, story points or percent done',
		guidance:
			`Story points are the Fibonacci run ${fibonacciStoryPoints.join(', ')}, with ` +
			'nothing in between. A task promoted from a client request carries the words the ' +
			'client used, so add to the details rather than rewriting them.',
		inputSchema: objectSchema(
			{
				taskId: taskIdField,
				title: textField(`A new title${keepText}`),
				details: textField(`New details${keepText}`),
				dueDate: textField(`A new due date, as YYYY-MM-DD${keepText}`),
				phaseId: textField(`The phase it sits in${keepText}`),
				storyPoints: storyPointsField,
				completionPercent: { type: 'number', description: 'How far through it is, 0 to 100' }
			},
			['taskId']
		),
		run: async (caller, input) => {
			const task = await getTask(caller.supabase, readText(input, 'taskId'));
			if (task === null) return noSuchTask;
			const edit = readTaskDetailsEdit(input, task);
			if (edit === null) return wrongStoryPoints;
			await updateTaskDetails(caller.supabase, task.id, edit);
			return `"${edit.title}" saved — ${edit.storyPoints} points, ${edit.completionPercent}% done.`;
		}
	}
];
