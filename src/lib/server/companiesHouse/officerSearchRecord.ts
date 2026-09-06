import { displayNameFromSearchTitle } from './officerName';
import { officerIdFromAppointmentsLink } from './officerLinks';

export type OfficerSearchResult = {
	officerId: string;
	name: string;
	appointmentCount: number;
	bornIn: string;
	addressSnippet: string;
};

export function parseOfficerSearch(body: Record<string, unknown>): OfficerSearchResult[] {
	const items = Array.isArray(body.items) ? (body.items as Record<string, unknown>[]) : [];
	return items.map(parseOfficer).filter((officer) => officer.officerId !== '');
}

function parseOfficer(item: Record<string, unknown>): OfficerSearchResult {
	const links = (item.links ?? {}) as Record<string, unknown>;
	return {
		officerId: officerIdFromAppointmentsLink(String(links.self ?? '')),
		name: displayNameFromSearchTitle(String(item.title ?? '')),
		appointmentCount: Number(item.appointment_count ?? 0),
		bornIn: describeBirth(item.date_of_birth),
		addressSnippet: String(item.address_snippet ?? '')
	};
}

function describeBirth(value: unknown): string {
	if (typeof value !== 'object' || value === null) return '';
	const birth = value as Record<string, unknown>;
	if (birth.year === undefined) return '';
	if (birth.month === undefined) return String(birth.year);
	return `${String(birth.month).padStart(2, '0')}/${birth.year}`;
}
