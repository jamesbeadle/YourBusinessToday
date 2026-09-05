import { fetchCompanyPages } from './fetchCompanyPages';
import { parsePublicUrl, type PublicPage } from './fetchPublicPage';

export type CompanyWebsite = { url: string; pages: PublicPage[] };

const guessedDomainSuffixes = ['.co.uk', '.com', '.uk'];
const guessedHostPrefixes = ['www.', ''];
const companySuffixPattern = /\b(ltd|limited|plc|llp|group|co)\b\.?/gi;

export async function resolveCompanyWebsite(query: string): Promise<CompanyWebsite | null> {
	for (const candidate of candidateUrlsFor(query)) {
		const pages = await fetchCompanyPages(candidate);
		if (pages.length > 0) return { url: pages[0].url, pages };
	}
	return null;
}

export function isWebAddressQuery(query: string): boolean {
	return parsePublicUrl(withScheme(query)) !== null && /\./.test(query) && !/\s/.test(query);
}

function candidateUrlsFor(query: string): string[] {
	if (isWebAddressQuery(query)) return [withScheme(query)];
	const slug = query.replace(companySuffixPattern, '').replace(/[^a-z0-9]/gi, '').toLowerCase();
	if (slug === '') return [];
	return guessedDomainSuffixes.flatMap((suffix) =>
		guessedHostPrefixes.map((prefix) => `https://${prefix}${slug}${suffix}`)
	);
}

function withScheme(query: string): string {
	if (/^https?:\/\//i.test(query)) return query;
	return `https://${query}`;
}
