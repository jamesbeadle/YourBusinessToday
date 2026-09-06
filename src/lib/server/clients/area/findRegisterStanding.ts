import type { SupabaseClient } from '@supabase/supabase-js';
import { parseClientStage } from '$lib/data/clientLifecycle';
import type { RegisterStanding } from './areaPin';

export type StandingByCompanyNumber = Map<string, RegisterStanding>;

export async function findRegisterStanding(
	supabase: SupabaseClient,
	companyNumbers: string[]
): Promise<StandingByCompanyNumber> {
	if (companyNumbers.length === 0) return new Map();
	const { data, error } = await supabase
		.from('clients')
		.select('id, company_number, lifecycle_stage')
		.in('company_number', companyNumbers)
		.eq('is_archived', false);
	if (error) throw error;
	return new Map(
		data.map((row: Record<string, unknown>) => [
			row.company_number as string,
			{ clientId: row.id as string, stage: parseClientStage(row.lifecycle_stage) }
		])
	);
}
