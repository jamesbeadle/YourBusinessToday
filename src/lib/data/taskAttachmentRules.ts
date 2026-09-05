export type AttachmentPreviewKind = 'image' | 'pdf';
export type AttachmentContentKind = 'text' | 'wordDocument' | 'link';

const megabyte = 1024 * 1024;
const kilobyte = 1024;

export const maxAttachmentByteCount = 25 * megabyte;

const pdfMimeType = 'application/pdf';
const wordDocumentMimeType =
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const textLikeMimeTypes = ['application/json', 'application/xml'];

export function isWithinAttachmentLimit(byteCount: number): boolean {
	return byteCount > 0 && byteCount <= maxAttachmentByteCount;
}

export function attachmentLimitDescription(): string {
	return 'Any file up to 25MB.';
}

export function describeByteCount(byteCount: number): string {
	if (byteCount >= megabyte) return `${(byteCount / megabyte).toFixed(1)} MB`;
	if (byteCount >= kilobyte) return `${Math.round(byteCount / kilobyte)} KB`;
	return `${byteCount} B`;
}

export function previewKindFor(mimeType: string): AttachmentPreviewKind | null {
	if (mimeType.startsWith('image/')) return 'image';
	if (mimeType === pdfMimeType) return 'pdf';
	return null;
}

export function contentKindFor(mimeType: string): AttachmentContentKind {
	if (mimeType === wordDocumentMimeType) return 'wordDocument';
	if (mimeType.startsWith('text/') || textLikeMimeTypes.includes(mimeType)) return 'text';
	return 'link';
}

export function fileExtensionLabel(filename: string): string {
	const extension = filename.split('.').pop() ?? '';
	if (extension === '' || extension === filename) return 'file';
	return extension.slice(0, 4);
}
