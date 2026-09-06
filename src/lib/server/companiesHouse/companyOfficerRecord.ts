import { displayNameFromRegisterName } from './officerName';
import { officerIdFromAppointmentsLink } from './officerLinks';

export type CompanyOfficer = {
	officerId: string;
	name: string;
	officerRole: string;
	appointedOn: string;
};

export function parseCompanyOfficers(body: Record<string, unknown>): CompanyOfficer[] {
	const items = Array.isArray(body.items) ? (body.items as Record<string, unknown>[]) : [];
	return items
		.filter(isStillAppointed)
		.map(parseOfficer)
		.filter((officer) => officer.officerId !== '');
}

function isStillAppointed(item: Record<string, unknown>): boolean {
	return item.resigned_on === undefined || item.resigned_on === null;
}

function parseOfficer(item: Record<string, unknown>): CompanyOfficer {
	const links = (item.links ?? {}) as Record<string, unknown>;
	const officerLinks = (links.officer ?? {}) as Record<string, unknown>;
	return {
		officerId: officerIdFromAppointmentsLink(String(officerLinks.appointments ?? '')),
		name: displayNameFromRegisterName(String(item.name ?? '')),
		officerRole: String(item.officer_role ?? ''),
		appointedOn: String(item.appointed_on ?? '')
	};
}
