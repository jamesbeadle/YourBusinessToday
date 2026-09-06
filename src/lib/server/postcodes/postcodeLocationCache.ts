import type { SupabaseClient } from '@supabase/supabase-js';
import type { PostcodeLocation } from './postcodeLocation';

const cacheTable = 'postcode_locations';

export async function readCachedLocations(
	supabase: SupabaseClient,
	postcodes: string[]
): Promise<PostcodeLocation[]> {
	if (postcodes.length === 0) return [];
	const { data, error } = await supabase
		.from(cacheTable)
		.select('postcode, outcode, latitude, longitude')
		.in('postcode', postcodes);
	if (error) throw error;
	return data.map((row: Record<string, unknown>) => ({
		postcode: row.postcode as string,
		outcode: row.outcode as string,
		latitude: Number(row.latitude),
		longitude: Number(row.longitude)
	}));
}

export async function cacheLocations(
	supabase: SupabaseClient,
	locations: PostcodeLocation[]
): Promise<void> {
	if (locations.length === 0) return;
	const { error } = await supabase.from(cacheTable).upsert(
		locations.map((location) => ({
			postcode: location.postcode,
			outcode: location.outcode,
			latitude: location.latitude,
			longitude: location.longitude,
			looked_up_at: new Date().toISOString()
		})),
		{ onConflict: 'postcode' }
	);
	if (error) throw error;
}
