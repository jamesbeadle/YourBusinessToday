import { companiesHouseApiOrigin, requestCompaniesHouse } from './companiesHouseRequest';
import { describeRegisteredAddress } from './registeredAddress';

export type CompaniesHouseSearch = { sicCodes: string[]; location: string };

export type CompaniesHouseCompany = {
	companyNumber: string;
	name: string;
	incorporatedOn: string;
	address: string;
	sicCodes: string[];
};

const advancedSearchPath = '/advanced-search/companies';
const activeCompanyStatus = 'active';
const longestResultPage = 50;

export function readCompaniesHouseSearch(searchParams: URLSearchParams): CompaniesHouseSearch | null {
	const sicCodes = (searchParams.get('sicCodes') ?? '')
		.split(/[,\s]+/)
		.map((code) => code.trim())
		.filter((code) => code !== '');
	const location = (searchParams.get('location') ?? '').trim();
	if (sicCodes.length === 0 && location === '') return null;
	return { sicCodes, location };
}

export async function searchCompaniesHouse(
	search: CompaniesHouseSearch
): Promise<CompaniesHouseCompany[]> {
	return parseCompanySearch(await requestCompaniesHouse(searchUrlFor(search)));
}

export function parseCompanySearch(body: Record<string, unknown>): CompaniesHouseCompany[] {
	const items = Array.isArray(body.items) ? (body.items as Record<string, unknown>[]) : [];
	return items.map(parseCompany);
}

function searchUrlFor(search: CompaniesHouseSearch): URL {
	const url = new URL(advancedSearchPath, companiesHouseApiOrigin);
	for (const code of search.sicCodes) url.searchParams.append('sic_codes', code);
	if (search.location !== '') url.searchParams.set('location', search.location);
	url.searchParams.set('company_status', activeCompanyStatus);
	url.searchParams.set('size', String(longestResultPage));
	return url;
}

function parseCompany(item: Record<string, unknown>): CompaniesHouseCompany {
	return {
		companyNumber: String(item.company_number ?? ''),
		name: String(item.company_name ?? ''),
		incorporatedOn: String(item.date_of_incorporation ?? ''),
		address: describeRegisteredAddress(item.registered_office_address),
		sicCodes: Array.isArray(item.sic_codes) ? item.sic_codes.map(String) : []
	};
}
