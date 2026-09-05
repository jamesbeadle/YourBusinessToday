import type { SupabaseClient } from '@supabase/supabase-js';
import { contentKindFor } from '$lib/data/taskAttachmentRules';
import { downloadAttachmentFile } from './downloadAttachmentFile';
import { extractWordDocumentText } from '$lib/server/brain/extractWordDocumentText';
import type { TaskAttachment } from './attachmentRecord';

export const maxAttachmentTextCharacters = 200_000;

export type AttachmentText = { text: string; isTruncated: boolean };

export async function readAttachmentText(
	supabase: SupabaseClient,
	attachment: TaskAttachment
): Promise<AttachmentText> {
	const fileBytes = await downloadAttachmentFile(supabase, attachment);
	const wholeText = await decode(fileBytes, attachment.mimeType);
	return {
		text: wholeText.slice(0, maxAttachmentTextCharacters),
		isTruncated: wholeText.length > maxAttachmentTextCharacters
	};
}

async function decode(fileBytes: Uint8Array, mimeType: string): Promise<string> {
	if (contentKindFor(mimeType) === 'wordDocument') return extractWordDocumentText(fileBytes);
	return new TextDecoder().decode(fileBytes);
}
