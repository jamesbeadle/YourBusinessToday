import { companiesHouseApiOrigin, requestCompaniesHouse } from './companiesHouseRequest';
import { parseOfficerSearch, type OfficerSearchResult } from './officerSearchRecord';

const officerSearchPath = '/search/officers';
const longestResultPage = 20;

export async function searchOfficers(query: string): Promise<OfficerSearchResult[]> {
	const url = new URL(officerSearchPath, companiesHouseApiOrigin);
	url.searchParams.set('q', query);
	url.searchParams.set('items_per_page', String(longestResultPage));
	return parseOfficerSearch(await requestCompaniesHouse(url));
}
