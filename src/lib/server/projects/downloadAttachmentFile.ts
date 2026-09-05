import type { SupabaseClient } from '@supabase/supabase-js';
import { attachmentsBucket } from './attachmentStorage';
import type { TaskAttachment } from './attachmentRecord';

export async function downloadAttachmentFile(
	supabase: SupabaseClient,
	attachment: TaskAttachment
): Promise<Uint8Array> {
	const { data, error } = await supabase.storage
		.from(attachmentsBucket)
		.download(attachment.storagePath);
	if (error !== null) throw error;
	return new Uint8Array(await data.arrayBuffer());
}
