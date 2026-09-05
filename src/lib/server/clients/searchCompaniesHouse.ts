import { env } from '$env/dynamic/private';

export type CompaniesHouseSearch = { sicCodes: string[]; location: string };

export type CompaniesHouseCompany = {
	companyNumber: string;
	name: string;
	incorporatedOn: string;
	address: string;
	sicCodes: string[];
};

const advancedSearchUrl = 'https://api.company-information.service.gov.uk/advanced-search/companies';
const activeCompanyStatus = 'active';
const longestResultPage = 50;
const fetchTimeoutMilliseconds = 10_000;

export function isCompaniesHouseConfigured(): boolean {
	return (env.COMPANIES_HOUSE_API_KEY ?? '') !== '';
}

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
	const response = await fetch(searchUrlFor(search), {
		signal: AbortSignal.timeout(fetchTimeoutMilliseconds),
		headers: { authorization: basicAuthorisation(), accept: 'application/json' }
	});
	if (!response.ok) throw new Error(`Companies House answered with status ${response.status}`);
	const body = (await response.json()) as { items?: Record<string, unknown>[] };
	return (body.items ?? []).map(parseCompany);
}

function searchUrlFor(search: CompaniesHouseSearch): string {
	const url = new URL(advancedSearchUrl);
	for (const code of search.sicCodes) url.searchParams.append('sic_codes', code);
	if (search.location !== '') url.searchParams.set('location', search.location);
	url.searchParams.set('company_status', activeCompanyStatus);
	url.searchParams.set('size', String(longestResultPage));
	return url.href;
}

function basicAuthorisation(): string {
	const credentials = Buffer.from(`${env.COMPANIES_HOUSE_API_KEY}:`).toString('base64');
	return `Basic ${credentials}`;
}

function parseCompany(item: Record<string, unknown>): CompaniesHouseCompany {
	const address = (item.registered_office_address ?? {}) as Record<string, unknown>;
	return {
		companyNumber: String(item.company_number ?? ''),
		name: String(item.company_name ?? ''),
		incorporatedOn: String(item.date_of_incorporation ?? ''),
		address: [address.address_line_1, address.locality, address.postal_code]
			.filter((part) => typeof part === 'string' && part !== '')
			.join(', '),
		sicCodes: Array.isArray(item.sic_codes) ? item.sic_codes.map(String) : []
	};
}
