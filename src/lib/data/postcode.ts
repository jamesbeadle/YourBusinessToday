const postcodePattern = /\b([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})\b/i;

export function postcodeIn(text: string): string {
	const match = postcodePattern.exec(text.trim());
	if (match === null) return '';
	return `${match[1]} ${match[2]}`.toUpperCase();
}

export function outcodeOf(postcode: string): string {
	return postcode.split(' ')[0] ?? '';
}
