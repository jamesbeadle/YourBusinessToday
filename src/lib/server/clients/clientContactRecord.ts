import {
	parseSeniority,
	parseWarmth,
	type Seniority,
	type Warmth
} from '$lib/data/contactProfileFields';

export type ContactProfile = {
	seniority: Seniority;
	isDecisionMaker: boolean;
	warmth: Warmth;
	lastContactedOn: string | null;
	nextAction: string;
	nextActionDue: string | null;
};

export type ClientContact = ContactProfile & {
	id: string;
	clientId: string;
	accountId: string | null;
	name: string;
	email: string;
	phone: string;
	role: string;
	isPrimary: boolean;
	sourceUrl: string;
	invitedAt: string | null;
	createdAt: string;
};

export function parseClientContactRecord(row: Record<string, unknown>): ClientContact {
	return {
		id: row.id as string,
		clientId: row.client_id as string,
		accountId: (row.account_id ?? null) as string | null,
		name: row.name as string,
		email: row.email as string,
		phone: row.phone as string,
		role: row.role as string,
		isPrimary: row.is_primary as boolean,
		sourceUrl: (row.source_url ?? '') as string,
		invitedAt: (row.invited_at ?? null) as string | null,
		createdAt: row.created_at as string,
		...parseContactProfileRecord(row)
	};
}

export function parseContactProfileRecord(row: Record<string, unknown>): ContactProfile {
	return {
		seniority: parseSeniority(row.seniority),
		isDecisionMaker: (row.is_decision_maker ?? false) as boolean,
		warmth: parseWarmth(row.warmth),
		lastContactedOn: (row.last_contacted_at ?? null) as string | null,
		nextAction: (row.next_action ?? '') as string,
		nextActionDue: (row.next_action_due ?? null) as string | null
	};
}

export function toContactProfileColumns(profile: ContactProfile): Record<string, unknown> {
	return {
		seniority: profile.seniority,
		is_decision_maker: profile.isDecisionMaker,
		warmth: profile.warmth,
		last_contacted_at: profile.lastContactedOn,
		next_action: profile.nextAction,
		next_action_due: profile.nextActionDue
	};
}
