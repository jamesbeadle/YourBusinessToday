import { htmlToPlainText } from '$lib/server/brain/htmlToPlainText';

export type PublicPage = { url: string; html: string; text: string };

const fetchTimeoutMilliseconds = 10_000;
const longestPageCharacters = 12_000;
const acceptedProtocols = ['http:', 'https:'];
const privateHostPattern = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|0\.|\[)/i;

export async function fetchPublicPage(pageUrl: string): Promise<PublicPage | null> {
	const parsed = parsePublicUrl(pageUrl);
	if (parsed === null) return null;
	const response = await fetch(parsed.href, {
		redirect: 'follow',
		signal: AbortSignal.timeout(fetchTimeoutMilliseconds),
		headers: { accept: 'text/html', 'user-agent': 'YourBusinessToday/1.0 (lead research)' }
	}).catch(() => null);
	if (response === null || !response.ok) return null;
	const contentType = response.headers.get('content-type') ?? '';
	if (!contentType.includes('text/html')) return null;
	const html = await response.text();
	const text = htmlToPlainText(html).slice(0, longestPageCharacters);
	if (text === '') return null;
	return { url: response.url || parsed.href, html, text };
}

export function parsePublicUrl(candidate: string): URL | null {
	let parsed: URL;
	try {
		parsed = new URL(candidate);
	} catch {
		return null;
	}
	if (!acceptedProtocols.includes(parsed.protocol)) return null;
	if (privateHostPattern.test(parsed.hostname)) return null;
	return parsed;
}
