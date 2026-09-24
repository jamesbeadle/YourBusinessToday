export function attachmentResponse(
	fileBytes: Uint8Array,
	fileName: string,
	contentType: string
): Response {
	return new Response(new Blob([fileBytes as Uint8Array<ArrayBuffer>]), {
		headers: {
			'Content-Type': contentType,
			'Content-Disposition': `attachment; filename="${fileName}"`,
			'Cache-Control': 'private, no-store'
		}
	});
}
