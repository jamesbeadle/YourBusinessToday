import { describeRegisteredAddress } from './registeredAddress';
import { displayNameFromRegisterName } from './officerName';

export type OfficerAppointment = {
	companyNumber: string;
	companyName: string;
	officerRole: string;
	appointedOn: string;
	address: string;
};

export type OfficerAppointments = { officerName: string; appointments: OfficerAppointment[] };

const activeCompanyStatus = 'active';

export function parseOfficerAppointments(body: Record<string, unknown>): OfficerAppointments {
	const items = Array.isArray(body.items) ? (body.items as Record<string, unknown>[]) : [];
	return {
		officerName: displayNameFromRegisterName(String(body.name ?? '')),
		appointments: items.filter(isCurrentAtActiveCompany).map(parseAppointment)
	};
}

function isCurrentAtActiveCompany(item: Record<string, unknown>): boolean {
	if (item.resigned_on !== undefined && item.resigned_on !== null) return false;
	const company = (item.appointed_to ?? {}) as Record<string, unknown>;
	return company.company_status === activeCompanyStatus;
}

function parseAppointment(item: Record<string, unknown>): OfficerAppointment {
	const company = (item.appointed_to ?? {}) as Record<string, unknown>;
	return {
		companyNumber: String(company.company_number ?? ''),
		companyName: String(company.company_name ?? ''),
		officerRole: String(item.officer_role ?? ''),
		appointedOn: String(item.appointed_on ?? ''),
		address: describeRegisteredAddress(item.address)
	};
}
