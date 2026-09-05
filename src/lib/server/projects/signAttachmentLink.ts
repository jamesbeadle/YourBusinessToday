import type { SupabaseClient } from '@supabase/supabase-js';
import { attachmentsBucket } from './attachmentStorage';
import type { TaskAttachment } from './attachmentRecord';

export type AttachmentLinkKind = 'open' | 'download';

const signedLinkLifetimeSeconds = 60;

export async function signAttachmentLink(
	supabase: SupabaseClient,
	attachment: TaskAttachment,
	kind: AttachmentLinkKind
): Promise<string> {
	const { data, error } = await supabase.storage
		.from(attachmentsBucket)
		.createSignedUrl(attachment.storagePath, signedLinkLifetimeSeconds, signingOptions(attachment, kind));
	if (error !== null) throw error;
	return data.signedUrl;
}

function signingOptions(attachment: TaskAttachment, kind: AttachmentLinkKind): { download?: string } {
	if (kind === 'open') return {};
	return { download: attachment.filename };
}
