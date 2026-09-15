export function bearerToken(request: Request): string {
	const header = request.headers.get('authorization') ?? '';
	if (!header.toLowerCase().startsWith('bearer ')) return '';
	return header.slice('bearer '.length).trim();
}
