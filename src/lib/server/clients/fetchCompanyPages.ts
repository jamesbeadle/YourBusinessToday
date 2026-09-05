import { fetchPublicPage, type PublicPage } from './fetchPublicPage';

const anchorPattern = /<a\s[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
const aboutPagePattern = /about|team|people|who-we-are|our-story|leadership|meet-the/i;

export async function fetchCompanyPages(websiteUrl: string): Promise<PublicPage[]> {
	const homepage = await fetchPublicPage(websiteUrl);
	if (homepage === null) return [];
	const aboutPageUrl = findAboutPageUrl(homepage);
	if (aboutPageUrl === null) return [homepage];
	const aboutPage = await fetchPublicPage(aboutPageUrl);
	if (aboutPage === null) return [homepage];
	return [homepage, aboutPage];
}

function findAboutPageUrl(homepage: PublicPage): string | null {
	const base = new URL(homepage.url);
	for (const match of homepage.html.matchAll(anchorPattern)) {
		const candidate = resolveSameSite(match[1], base);
		if (candidate === null) continue;
		if (candidate === homepage.url) continue;
		if (aboutPagePattern.test(candidate) || aboutPagePattern.test(match[2])) return candidate;
	}
	return null;
}

function resolveSameSite(href: string, base: URL): string | null {
	try {
		const resolved = new URL(href, base);
		if (resolved.hostname !== base.hostname) return null;
		return resolved.href;
	} catch {
		return null;
	}
}
