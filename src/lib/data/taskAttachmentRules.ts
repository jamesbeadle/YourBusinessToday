const megabyte = 1024 * 1024;

export const maxAttachmentByteCount = 25 * megabyte;

export function isWithinAttachmentLimit(byteCount: number): boolean {
	return byteCount > 0 && byteCount <= maxAttachmentByteCount;
}

export function attachmentLimitDescription(): string {
	return 'Any file up to 25MB.';
}

export function describeByteCount(byteCount: number): string {
	if (byteCount >= megabyte) return `${(byteCount / megabyte).toFixed(1)} MB`;
	const kilobyte = 1024;
	if (byteCount >= kilobyte) return `${Math.round(byteCount / kilobyte)} KB`;
	return `${byteCount} B`;
}
