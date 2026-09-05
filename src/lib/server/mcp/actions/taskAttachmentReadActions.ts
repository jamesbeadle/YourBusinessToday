import type { SupabaseClient } from '@supabase/supabase-js';
import { contentKindFor, describeByteCount } from '$lib/data/taskAttachmentRules';
import { findTaskAttachment } from '$lib/server/projects/findTaskAttachment';
import { getTask } from '$lib/server/projects/getTask';
import { noSuchAttachment } from './describeAttachments';
import { noSuchTask } from './describeTask';
import { objectSchema, readText, textField } from '../actionTypes';
import {
	maxAttachmentTextCharacters,
	readAttachmentText
} from '$lib/server/projects/readAttachmentText';
import {
	agentFetchLifetimeSeconds,
	signAttachmentLink
} from '$lib/server/projects/signAttachmentLink';
import type { McpAction } from '../actionTypes';
import type { TaskAttachment } from '$lib/server/projects/attachmentRecord';

const characterCap = maxAttachmentTextCharacters.toLocaleString('en-GB');

export const taskAttachmentReadActions: McpAction[] = [
	{
		name: 'read_task_attachment',
		area: 'tasks',
		audience: 'staff',
		isWrite: false,
		summary: 'open one attachment on a task — its text, or a link to fetch the file',
		guidance:
			'Text, markdown, CSV, JSON and Word files come back as their text, cut off at ' +
			`${characterCap} characters. Everything else — PDFs, images, spreadsheets, archives — ` +
			'comes back as a link that works for ten minutes; fetch it directly from there.',
		inputSchema: objectSchema(
			{
				taskId: textField('The task id'),
				attachmentId: textField('The attachment id, as read_task lists it')
			},
			['taskId', 'attachmentId']
		),
		run: async (caller, input) => {
			const task = await getTask(caller.supabase, readText(input, 'taskId'));
			if (task === null) return noSuchTask;
			const attachment = await findTaskAttachment(
				caller.supabase,
				task.id,
				readText(input, 'attachmentId')
			);
			if (attachment === null) return noSuchAttachment;
			if (contentKindFor(attachment.mimeType) === 'link') {
				return linkAnswer(caller.supabase, attachment);
			}
			return textAnswer(caller.supabase, attachment);
		}
	}
];

async function textAnswer(supabase: SupabaseClient, attachment: TaskAttachment): Promise<string> {
	const { text, isTruncated } = await readAttachmentText(supabase, attachment);
	const heading = `${attachment.filename} (${describeByteCount(attachment.byteCount)}):`;
	const ending = isTruncated ? `\n\n[cut off at ${characterCap} characters]` : '';
	return `${heading}\n\n${text}${ending}`;
}

async function linkAnswer(supabase: SupabaseClient, attachment: TaskAttachment): Promise<string> {
	const link = await signAttachmentLink(
		supabase,
		attachment,
		'download',
		agentFetchLifetimeSeconds
	);
	const description = `${describeByteCount(attachment.byteCount)}, ${attachment.mimeType}`;
	return `${attachment.filename} (${description}). Fetch it within ten minutes from:\n${link}`;
}
