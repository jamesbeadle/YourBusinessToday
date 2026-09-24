const xmlEscapes: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;'
};

export function escapeXml(text: string): string {
	return text.replace(/[&<>"]/g, (character) => xmlEscapes[character]);
}
