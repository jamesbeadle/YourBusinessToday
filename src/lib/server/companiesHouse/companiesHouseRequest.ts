import { env } from '$env/dynamic/private';

export const companiesHouseApiOrigin = 'https://api.company-information.service.gov.uk';

const fetchTimeoutMilliseconds = 10_000;

export function isCompaniesHouseConfigured(): boolean {
	return (env.COMPANIES_HOUSE_API_KEY ?? '') !== '';
}

export async function requestCompaniesHouse(url: URL): Promise<Record<string, unknown>> {
	const response = await fetch(url, {
		signal: AbortSignal.timeout(fetchTimeoutMilliseconds),
		headers: { authorization: basicAuthorisation(), accept: 'application/json' }
	});
	if (!response.ok) throw new Error(`Companies House answered with status ${response.status}`);
	return (await response.json()) as Record<string, unknown>;
}

function basicAuthorisation(): string {
	const credentials = Buffer.from(`${env.COMPANIES_HOUSE_API_KEY}:`).toString('base64');
	return `Basic ${credentials}`;
}
