import {
	parseSeniority,
	parseWarmth,
	type Seniority,
	type Warmth
} from '$lib/data/contactProfileFields';
import { parseLeadSource, type LeadSource } from '$lib/data/leadSources';

export type PersonProfile = {
	seniority: Seniority;
	isDecisionMaker: boolean;
	warmth: Warmth;
	lastContactedOn: string | null;
	nextAction: string;
	nextActionDue: string | null;
};

export type Person = PersonProfile & {
	id: string;
	name: string;
	email: string;
	phone: string;
	officerId: string | null;
	sourceUrl: string;
	leadSource: LeadSource;
	createdAt: string;
};

export function parsePersonRecord(row: Record<string, unknown>): Person {
	return {
		id: row.id as string,
		name: row.name as string,
		email: (row.email ?? '') as string,
		phone: (row.phone ?? '') as string,
		officerId: (row.companies_house_officer_id ?? null) as string | null,
		sourceUrl: (row.source_url ?? '') as string,
		leadSource: parseLeadSource(row.lead_source),
		createdAt: row.created_at as string,
		...parsePersonProfileRecord(row)
	};
}

export function parsePersonProfileRecord(row: Record<string, unknown>): PersonProfile {
	return {
		seniority: parseSeniority(row.seniority),
		isDecisionMaker: (row.is_decision_maker ?? false) as boolean,
		warmth: parseWarmth(row.warmth),
		lastContactedOn: (row.last_contacted_at ?? null) as string | null,
		nextAction: (row.next_action ?? '') as string,
		nextActionDue: (row.next_action_due ?? null) as string | null
	};
}

export function toPersonProfileColumns(profile: PersonProfile): Record<string, unknown> {
	return {
		seniority: profile.seniority,
		is_decision_maker: profile.isDecisionMaker,
		warmth: profile.warmth,
		last_contacted_at: profile.lastContactedOn,
		next_action: profile.nextAction,
		next_action_due: profile.nextActionDue
	};
}
