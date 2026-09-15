import { reachableTask } from '../projectAccess';
import {
	contentKindFor,
	describeByteCount,
	maxInlineAttachmentByteCount,
	type AttachmentContentKind
} from '$lib/data/taskAttachmentRules';
import { findTaskAttachment } from '$lib/server/projects/findTaskAttachment';
import { noSuchAttachment } from './describeAttachments';
import { noSuchTask } from './describeTask';
import { objectSchema, readText, textField } from '../actionTypes';
import {
	characterCap,
	fileAnswer,
	imageAnswer,
	linkAnswer,
	pdfAnswer,
	textAnswer,
	type AttachmentAnswer
} from './attachmentAnswers';
import type { McpAction } from '../actionTypes';

const inlineCap = describeByteCount(maxInlineAttachmentByteCount);

const answerByKind: Record<AttachmentContentKind, AttachmentAnswer> = {
	text: textAnswer,
	wordDocument: textAnswer,
	spreadsheet: textAnswer,
	pdf: pdfAnswer,
	image: imageAnswer,
	file: fileAnswer,
	link: linkAnswer
};

export const taskAttachmentReadActions: McpAction[] = [
	{
		name: 'read_task_attachment',
		area: 'tasks',
		audience: 'everyone',
		isWrite: false,
		summary: 'open one attachment on a task — its text, the image itself, or the file',
		guidance:
			'Text, markdown, CSV, JSON and Word files come back as their text; PDFs as their text ' +
			'with a marker before each page; spreadsheets as CSV, one block per sheet — all cut off ' +
			`at ${characterCap} characters. Images up to ${inlineCap} come back as the image and other ` +
			`files up to ${inlineCap} as the file itself, so nothing needs fetching. Anything bigger, or a PDF ` +
			'with no text layer, comes back as a link that works for ten minutes.',
		inputSchema: objectSchema(
			{
				taskId: textField('The task id'),
				attachmentId: textField('The attachment id, as read_task lists it')
			},
			['taskId', 'attachmentId']
		),
		run: async (caller, input) => {
			const task = await reachableTask(caller, readText(input, 'taskId'));
			if (task === null) return noSuchTask;
			const attachment = await findTaskAttachment(
				caller.supabase,
				task.id,
				readText(input, 'attachmentId')
			);
			if (attachment === null) return noSuchAttachment;
			const answer = answerByKind[contentKindFor(attachment.mimeType, attachment.byteCount)];
			return answer(caller.supabase, attachment);
		}
	}
];
