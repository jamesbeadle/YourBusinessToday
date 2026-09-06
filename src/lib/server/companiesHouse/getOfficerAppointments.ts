import { companiesHouseApiOrigin, requestCompaniesHouse } from './companiesHouseRequest';
import { parseOfficerAppointments, type OfficerAppointments } from './officerAppointmentRecord';

const longestResultPage = 50;

export async function getOfficerAppointments(officerId: string): Promise<OfficerAppointments> {
	const url = new URL(`/officers/${encodeURIComponent(officerId)}/appointments`, companiesHouseApiOrigin);
	url.searchParams.set('items_per_page', String(longestResultPage));
	return parseOfficerAppointments(await requestCompaniesHouse(url));
}
