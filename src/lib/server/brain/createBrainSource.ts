import { sourcesBucket } from './brainStorage';
import type { SupabaseClient } from '@supabase/supabase-js';

export type SourceUploadGrant = {
	sourceId: string;
	uploadUrl: string;
};

export async function createBrainSource(
	supabase: SupabaseClient,
	userId: string,
	upload: { filename: string; mimeType: string; byteCount: number }
): Promise<SourceUploadGrant> {
	const sourceId = crypto.randomUUID();
	const uploadPath = `${userId}/${sourceId}/${safeFilename(upload.filename)}`;
	const { error: insertError } = await supabase.from('brain_sources').insert({
		id: sourceId,
		filename: upload.filename,
		mime_type: upload.mimeType,
		byte_count: upload.byteCount,
		storage_path: uploadPath
	});
	if (insertError !== null) throw insertError;
	const { data, error } = await supabase.storage
		.from(sourcesBucket)
		.createSignedUploadUrl(uploadPath);
	if (error !== null) throw error;
	return { sourceId, uploadUrl: data.signedUrl };
}

function safeFilename(filename: string): string {
	return filename.replace(/[^a-zA-Z0-9._-]+/g, '-');
}
