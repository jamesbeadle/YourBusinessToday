import type { SupabaseClient } from '@supabase/supabase-js';

export type StoredBrainSource = {
	id: string;
	filename: string;
	mimeType: string;
	storagePath: string;
	status: string;
};

export async function findBrainSource(
	supabase: SupabaseClient,
	sourceId: string
): Promise<StoredBrainSource | null> {
	const { data, error } = await supabase
		.from('brain_sources')
		.select('id, filename, mime_type, storage_path, status')
		.eq('id', sourceId)
		.maybeSingle();
	if (error !== null) throw error;
	if (data === null) return null;
	return {
		id: data.id,
		filename: data.filename,
		mimeType: data.mime_type,
		storagePath: data.storage_path,
		status: data.status
	};
}

export async function markSourceStatus(
	supabase: SupabaseClient,
	sourceId: string,
	status: 'ingested' | 'failed',
	summary = ''
): Promise<void> {
	const { error } = await supabase
		.from('brain_sources')
		.update({ status, ...(summary === '' ? {} : { summary }) })
		.eq('id', sourceId);
	if (error !== null) throw error;
}
