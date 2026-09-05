import { claimBuild } from '$lib/server/builder/claimBuild';
import { describeBuildPack } from '$lib/server/builder/describeBuildPack';
import { getTask } from '$lib/server/projects/getTask';
import { noSuchTask } from './describeTask';
import { objectSchema, readText, textField } from '../actionTypes';
import { reportBuild, type BuildReport } from '$lib/server/builder/reportBuild';
import type { McpAction } from '../actionTypes';

const taskIdField = textField('The task id, exactly as the routine-fire payload names it');

export const builderActions: McpAction[] = [
	{
		name: 'claim_build',
		area: 'tasks',
		audience: 'staff',
		isWrite: true,
		summary: 'the Builder takes a queued task and receives everything it needs to build it',
		guidance:
			'For the Builder routine only. Answers with the brief, the criteria, the repository, ' +
			'the branch to use and the doctrine to follow. Refuses a task that is not queued.',
		inputSchema: objectSchema({ taskId: taskIdField }, ['taskId']),
		run: async (caller, input) => {
			const outcome = await claimBuild(caller.supabase, readText(input, 'taskId'));
			if (outcome.kind === 'refused') return outcome.sentence;
			return describeBuildPack(outcome.pack);
		}
	},
	{
		name: 'report_build',
		area: 'tasks',
		audience: 'staff',
		isWrite: true,
		summary: 'the Builder says what it did: the pull request, the schema, the outcome',
		guidance:
			'Outcome is in_review when a pull request is open, failed when the criteria could not ' +
			'be met. hasMigration is true if any file under the migrations folder changed. ' +
			'The note is read by staff as a task comment; one paragraph.',
		inputSchema: objectSchema(
			{
				taskId: taskIdField,
				outcome: textField('in_review or failed'),
				pullRequestUrl: textField('The pull request URL, or empty if none was opened'),
				hasMigration: { type: 'boolean', description: 'Whether a migration file changed' },
				note: textField('What was done, or why it failed')
			},
			['taskId', 'outcome', 'note']
		),
		run: async (caller, input) => {
			const task = await getTask(caller.supabase, readText(input, 'taskId'));
			if (task === null) return noSuchTask;
			const report = readReport(input);
			if (report === null) return 'Outcome is in_review or failed. Say which.';
			const recorded = await reportBuild(caller.supabase, task, report, caller.accountId);
			if (recorded === 'not_building') return `"${task.title}" is not being built. Nothing recorded.`;
			return `Recorded on "${task.title}": ${report.outcome}.`;
		}
	}
];

function readReport(input: Record<string, unknown>): BuildReport | null {
	const outcome = readText(input, 'outcome');
	if (outcome !== 'in_review' && outcome !== 'failed') return null;
	return {
		outcome,
		pullRequestUrl: readText(input, 'pullRequestUrl'),
		hasMigration: input.hasMigration === true,
		note: readText(input, 'note')
	};
}
