export function describeRegisteredAddress(value: unknown): string {
	if (typeof value !== 'object' || value === null) return '';
	const address = value as Record<string, unknown>;
	return [address.address_line_1, address.locality, address.postal_code]
		.filter((part) => typeof part === 'string' && part !== '')
		.join(', ');
}

export function postcodeOfRegisteredAddress(value: unknown): string {
	if (typeof value !== 'object' || value === null) return '';
	const address = value as Record<string, unknown>;
	return typeof address.postal_code === 'string' ? address.postal_code.trim() : '';
}
